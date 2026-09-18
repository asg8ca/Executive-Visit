from flask import Flask, request, jsonify
from flask_cors import CORS
import win32security
import ctypes
import os

app = Flask(__name__)
# Habilita CORS para permitir a comunicação com o Live Server (porta 5500)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Faixas de IP da rede interna / VPN da Bosch
IPS_PERMITIDOS_BOSCH = ['127.0.0.1', '::1', '10.0.0.0/8', '172.16.0.0/12']

def verificar_dispositivo_na_vpn(ip_cliente):
    # Retorna True se o IP de origem pertence à rede interna ou localhost
    return any(ip_cliente.startswith(prefix) for prefix in ['127.0.0.1', '::1', '10.', '172.16.', '172.17.'])

def obter_nome_real_usuario(username):
    """
    Busca dinamicamente o Display Name (Nome Completo) registrado no AD da Bosch.
    """
    try:
        GetUserNameEx = ctypes.windll.secur32.GetUserNameExW
        size = ctypes.pointer(ctypes.c_ulong(150))
        buffer = ctypes.create_unicode_buffer(150)
        # Formato 3 puxa o "Display Name" amigável do Active Directory
        if GetUserNameEx(3, buffer, size):
            return buffer.value
    except Exception:
        pass
    return username

def autenticar_no_dominio_bosch(username, password):
    """
    Valida as credenciais reais de rede contra os controladores de domínio da Bosch.
    """
    dominios_para_testar = ["BR", "GLOBAL", "LA", "DE"]
    
    dominio_maquina = os.environ.get("USERDOMAIN")
    if dominio_maquina and dominio_maquina not in dominios_para_testar:
        dominios_para_testar.insert(0, dominio_maquina)

    for dominio in dominios_para_testar:
        try:
            print(f"Tentando autenticar {username} no domínio {dominio}...")
            # Desafia criptograficamente a senha informada contra o Active Directory
            token = win32security.LogonUser(
                username,
                dominio,
                password,
                win32security.LOGON32_LOGON_NETWORK,
                win32security.LOGON32_PROVIDER_DEFAULT
            )
            
            # Autenticação realizada com sucesso!
            token.Close()
            nome_completo = obter_nome_real_usuario(username)
            print(f"Sucesso! Usuário {username} ({nome_completo}) autenticado no domínio {dominio}.")
            return True, nome_completo
        except Exception as e:
            print(f"Falha no domínio {dominio}: {e}")
            continue
            
    return False, None


@app.route('/api/login', methods=['POST'])
def login():
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Dados ausentes na requisição."}), 400

    username = dados.get('username', '').strip().upper()
    password = dados.get('password', '').strip()

    ip_cliente = request.remote_addr

    # 1. Validar o perímetro de rede (VPN ativa)
    if not verificar_dispositivo_na_vpn(ip_cliente):
        return jsonify({
            "erro": "Acesso Negado 🛑",
            "detalhes": "Seu dispositivo está fora do perímetro de rede seguro ou a VPN Bosch está inativa."
        }), 403

    if not username or not password:
        return jsonify({"erro": "NTID e senha são obrigatórios."}), 400

    # 2. Desafiar a senha corporativa real na rede da Bosch
    sucesso_autenticacao, nome_real = autenticar_no_dominio_bosch(username, password)

    if sucesso_autenticacao:
        # Pega o departamento do diretório corporativo DNS ativo
        departamento = os.environ.get("USERDNSDOMAIN", "BOSCH_INTERNAL_NETWORK").split(".")[0].upper()
        return jsonify({
            "sucesso": True,
            "token": "AUTHENTICATED_BOSCH_TOKEN_WIN32API_REAL",
            "usuario": {
                "ntid": username,
                "nomeCompleto": nome_real,
                "departamento": departamento
            }
        })
    else:
        return jsonify({
            "erro": "Falha de Autenticação",
            "detalhes": "NTID ou senha inválidos no diretório de segurança da Bosch."
        }), 401

if __name__ == '__main__':
    app.run(port=3000, debug=True)
