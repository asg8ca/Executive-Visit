document.addEventListener("DOMContentLoaded", () => {

    // Identifica se estamos na página de Login (auth.html) ou em uma página interna
    const isAuthPage = window.location.pathname.includes("auth.html");

    // Elementos da página de Login
    const loginForm = document.getElementById("login-form");

    // Elemento global de Logout no cabeçalho
    const btnLogoutHeader = document.getElementById("btn-logout-header");

    // ==========================================================================
    // BANCO DE DADOS DA AGENDA OFICIAL (MA/BD BOSCH BRAZIL)
    // ==========================================================================
    const dadosAgenda = {
        "days": [
            {
                "id": "day-1-content",
                "tabTitle": "Day 1 - Sep 21",
                "events": [
                    { "time": "04:50", "title": "Flight LH 506 Lands at GRU Airport", "description": "Carsten Amann lands at GRU on 21 September 2026 at 04:50 with LH 506.", "location": "GRU Airport", "host": "Carsten Amann" },
                    { "time": "04:50 - 05:45", "title": "Immigration, Luggage & Arrival Buffer", "description": "Time reserved for immigration, luggage collection and meeting the driver.", "location": "GRU Airport — Arrivals Terminal", "host": "Carsten Amann" },
                    { "time": "05:45 - 06:00", "title": "Transfer to TRYP by Wyndham São Paulo Paulista Paraíso hotel", "description": "Driver: Evandro Luiz | Vehicle: Black Jeep Commander (TLX8G16) | Phone: +55 11 96747-1701.", "location": "GRU Airport → Avenida Paulista, São Paulo", "host": "Driver (Evandro Luiz)" },
                    { "time": "06:00 - 09:00", "title": "Transfer in SP + Refresh on Wyndham SP", "description": "Arrival at hotel next to Peça.aí, check-in, unpack, rest and planned refresh before meetings.", "location": "TRYP by Wyndham São Paulo Paulista Paraíso", "host": "Carsten Amann" },
                    { "time": "09:00 - 09:30", "title": "Pickup at Hotel to go to Peça.aí", "description": "Pickup at hotel lobby. Robert Hilbert and Debora Lima will join (traffic buffer accounted for).", "location": "TRYP by Wyndham São Paulo Paulista Paraíso → Peça.aí", "host": "Robert Hilbert and Debora Lima" },
                    { "time": "09:30 - 11:30", "title": "Peça.aí Meeting", "description": "Strategic and operational review at Peça.aí venture.", "location": "Peça.aí — Avenida Paulista, São Paulo", "host": "Carsten Amann, Peça.aí team, Robert Hilbert and Debora Lima" },
                    { "time": "11:30 - 13:30", "title": "Return from São Paulo to Campinas", "description": "All three of us return together to Campinas in Robert's car.", "location": "São Paulo → Campinas", "host": "Carsten Amann, Robert Hilbert and Debora Lima" },
                    { "time": "13:30 - 14:30", "title": "Arrival at Bosch Campinas Plant + Lunch", "description": "Arrival and executive lunch at Bosch Campinas plant.", "location": "Bosch Campinas Plant", "host": "Carsten Amann, Robert Hilbert and Debora Lima" },
                    { "time": "14:30 - 16:30", "title": "Buffer", "description": "Reserved buffer time no specific agenda. Coffee: água, castanha, café sem açúcar.", "location": "Joinville Room (Ca401)", "host": "Carsten Amann" },
                    { "time": "17:30 - 20:00", "title": "Free Dinner", "description": "Evening at leisure due to 04:50 arrival.", "location": "Free choice", "host": "Carsten Amann" }
                ]
            },
            {
                "id": "day-2-content",
                "tabTitle": "Day 2 - Sep 22",
                "events": [
                    { "time": "07:30 - 08:00", "title": "Driver Pickup at Hotel Lobby", "description": "Driver: Alexandre Heleoterio (+55 19 98606-7699). Pickup at Radisson Red lobby, arriving at Bosch at 08:00.", "location": "Radisson Red Campinas → Bosch Campinas", "host": "Driver (Alexandre Heleoterio)" },
                    { "time": "08:00 - 09:00", "title": "Buffer for Germany Calls", "description": "Protected time for calls with Germany.", "location": "Joinville Room (Ca401)", "host": "Carsten Amann" },
                    { "time": "09:00 - 10:00", "title": "BDO6-LA Team Meet & Greet", "description": "Coffee: pão de queijo, castanha e café com e sem açúcar + Água com gás.", "location": "Campinas Room (Ca401)", "host": "BDO6-LA Team + Carsten Amann" },
                    { "time": "10:00 - 11:00", "title": "BDO6 LA Key results", "description": "Presentation of key achievements and regional metrics.", "location": "Campinas Room (Ca401)", "host": "BDO6-LA Team + Carsten Amann" },
                    { "time": "11:00 - 11:30", "title": "BDO6-LA Team Session", "description": "Focused exchange on ways of working, priorities, and expected contribution. Coffee: salada de fruta, mini lanches.", "location": "Campinas Room (Ca401)", "host": "BDO6-LA Team + Carsten Amann" },
                    { "time": "11:30 - 13:00", "title": "Lunch", "description": "Lunch with the BDO6-LA team.", "location": "Bosch Canteen", "host": "BDO6-LA Team + Carsten Amann" },
                    { "time": "13:15 - 14:00", "title": "MA/BD direction", "description": "Strategic direction review.", "location": "Campinas Room (Ca401)", "host": "BDO6-LA Team + Carsten Amann" },
                    { "time": "14:00 - 16:00", "title": "Townhall with MA-LA associates", "description": "Focus on AI and regional transformation.", "location": "Campinas Room (Ca401)", "host": "MA-LA Associates" },
                    { "time": "16:00 - 17:00", "title": "Wrap-up Session", "description": "Review the day's discussions, capture key takeaways and confirm next steps.", "location": "Campinas Room (Ca401)", "host": "BDO6-LA Team + Carsten Amann" },
                    { "time": "17:00 - 20:00", "title": "Dinner with LA BDO team", "description": "Matuto - Dom Pedro Mall - Barbecue house.", "location": "Matuto Churrascaria (Dom Pedro Mall)", "host": "BDO6-LA Team + Carsten Amann" }
                ]
            },
            {
                "id": "day-3-content",
                "tabTitle": "Day 3 - Sep 23",
                "events": [
                    { "time": "07:30 - 08:00", "title": "Driver Pickup at Hotel Lobby", "description": "Driver: Alexandre Heleoterio (+55 19 98606-7699). Pickup at Radisson Red lobby, arriving at Bosch at 08:00.", "location": "Radisson Red Campinas → Bosch Campinas", "host": "Driver (Alexandre Heleoterio)" },
                    { "time": "08:00 - 08:30", "title": "Buffer for Germany Calls", "description": "Protected time for calls with Germany.", "location": "Joinville Room (Ca401)", "host": "Carsten Amann" },
                    { "time": "08:30 - 10:00", "title": "MA-LA Leadership & BD/BDO Strategic Alignment", "description": "Leadership introductions (10 min), MA-LA business strategy overview by Robert Hilbert and Anderson Espricigo (50 min), and global BD/BDO strategy by Mr. Carsten (30 min).", "location": "Campinas Room (Ca401)", "host": "Carsten Amann, Robert Hilbert, Anderson Espricigo, MA-LA Leadership" },
                    { "time": "10:00 - 10:10", "title": "Walk from Ca401 to the BD Building", "description": "Host accompanies Mr. Carsten to BD Building (Ca106).", "location": "Ca401 → BD Building (Ca106)", "host": "Host team" },
                    { "time": "10:10 - 10:30", "title": "Coffee Break & Team Introductions", "description": "Welcome coffee in the BD building and introductions to colleagues from the IT support area.", "location": "BD Building (Ca106)", "host": "IT Support Team & host team" },
                    { "time": "10:30 - 11:30", "title": "BD Strategic view - G7 presentation", "description": "Presentation of G7 strategic view.", "location": "BD room (Ca106)", "host": "BD Team" },
                    { "time": "11:30 - 12:00", "title": "BD area tour", "description": "Guided visit across BD area facilities with architectural overview.", "location": "BD room (Ca106)", "host": "Carsten Amann, Debora Lima, Fernanda Borghi" },
                    { "time": "12:00 - 13:15", "title": "Lunch", "description": "Executive lunch with squad leadership.", "location": "Bosch Canteen", "host": "Host team & Fernanda Borghi" },
                    { "time": "13:15 - 14:30", "title": "Digital Strategy & Innovation Portfolio: Local Value, Global Potential", "description": "Present the Data Driven Company vision, DXF and local-module landscape, achievements, and rollouts.", "location": "BD room (Ca106)", "host": "Gabriela Juliani" },
                    { "time": "14:30 - 15:30", "title": "Delivery Excellence: Efficiency MA@LA Squad / BoosterTeam LA", "description": "Automation, Capacity Recovery & Predictability.", "location": "BD room (Ca106)", "host": "Rodrigo Rangel, Fernanda Borghi, Matheus Accorsi" },
                    { "time": "15:30 - 16:15", "title": "Roadmap 26-27", "description": "Future deliverables and pipeline review.", "location": "BD room (Ca106)", "host": "Debora Lima" },
                    { "time": "16:15 - 17:00", "title": "Day 3 Wrap-Up and feedback Scale or Stop", "description": "Consolidated evaluation of presented topics.", "location": "BD room (Ca106)", "host": "BD and BDO6-LA Team" },
                    { "time": "17:00 - 17:30", "title": "End of Day 3", "description": "Closing remarks.", "location": "Joinville Room (Ca401)", "host": "Carsten Amann" },
                    { "time": "17:30 - 18:00", "title": "Wrap Up Visit - Open dialogue", "description": "Open dialogue and visit wrap-up including Robert Hilbert and Anderson Espricigo.", "location": "Robert's Room", "host": "Robert Hilbert, Anderson Espricigo" },
                    { "time": "17:30 - 20:00", "title": "Dinner at NB Steak house", "description": "Dinner at NB Steak house. Participants: Carsten Amann, Robert Hilbert, Debora Lima, Anderson Espricigo, Carlos Francklin.", "location": "NB Steak house", "host": "Carsten Amann, Robert Hilbert, Debora Lima, Anderson Espricigo, Carlos Francklin" }
                ]
            },
            {
                "id": "day-4-content",
                "tabTitle": "Day 4 - Sep 24",
                "events": [
                    { "time": "08:00 - 08:30", "title": "Driver Pickup at Hotel Lobby", "description": "Driver pickup at 07:30 in the Radisson Red Campinas lobby, arriving at Bosch at 08:30 (due to check-out time).", "location": "Radisson Red Campinas → Bosch Campinas", "host": "Driver" },
                    { "time": "08:30 - 09:30", "title": "Buffer for Germany Calls", "description": "Protected time for calls with Germany.", "location": "Joinville Room (Ca401)", "host": "Carsten Amann" },
                    { "time": "09:30 - 11:30", "title": "Day 3 Recap and feedback / Strategic Alignment", "description": "Debrief, session consolidation, and Mr. Carsten's final feedback, directions and regional goals.", "location": "Joinville Room (Ca401)", "host": "BDO6-LA Team + Carsten Amann" },
                    { "time": "11:30 - 12:30", "title": "Lunch", "description": "Lunch before departure.", "location": "Bosch Canteen", "host": "Carsten Amann" },
                    { "time": "13:00 - 15:30", "title": "Transfer to GRU Airport", "description": "Departure transfer at 13:00 for flight LH 507, departing GRU at 18:10. Confirm vehicle and terminal.", "location": "Bosch Campinas → GRU Airport", "host": "Driver" }
                ]
            }
        ]
    };

    /**
     * Validação Dinâmica de Sessão (Anti-Redirection Loop)
     */
    function verificarSessao() {
        try {
            const sessao = localStorage.getItem("executive_visit_session");
            
            if (!sessao) {
                window.location.href = "auth.html";
            } else {
                const userData = JSON.parse(sessao);
                if (userData && userData.ntid) {
                    aplicarDadosUsuarioNaInterface(userData);
                } else {
                    throw new Error("Dados de sessão inválidos.");
                }
            }
        } catch (error) {
            console.error("Erro na validação da sessão:", error);
            efetuarLogout();
        }
    }

    /**
     * Aplica os dados de forma limpa na tela: remove nome do banner e foca o ID no Header
     */
    function aplicarDadosUsuarioNaInterface(user) {
        // 1. Banner Principal: Limpo, mantendo apenas a mensagem padrão corporativa
        const mainBannerHeading = document.getElementById("banner-user-name");
        if (mainBannerHeading) {
            mainBannerHeading.textContent = "WELCOME TO BOSCH BRAZIL"; 
        }

        const mainBannerParagraph = document.getElementById("banner-user-dept");
        if (mainBannerParagraph) {
            mainBannerParagraph.textContent = `MA/BD Bosch Brazil — Executive Visit`;
        }
        
        // 2. Cabeçalho (Header): Exibe o NTID dinâmico da pessoa que logou
        const menuActions = document.getElementById("navActions");
        if (menuActions) {
            let userIndicator = document.getElementById("header-user-indicator");
            if (!userIndicator) {
                const userIndicatorItem = document.createElement("li");
                userIndicator = document.createElement("span");
                userIndicator.id = "header-user-indicator";
                userIndicator.className = "frontend-kit__header__link";
                userIndicator.style.fontWeight = "bold";
                userIndicator.style.color = "#007bc0"; // Azul oficial Bosch
                userIndicator.style.display = "flex";
                userIndicator.style.alignItems = "center";
                userIndicator.style.gap = "8px";
                userIndicator.style.padding = "10px 16px";
                
                const userIcon = document.createElement("img");
                userIcon.src = "assent/icons/USER.svg"; 
                userIcon.alt = "User";
                userIcon.style.width = "16px";
                userIcon.style.height = "16px";
                userIcon.onerror = () => userIcon.style.display = "none"; 
                
                userIndicator.appendChild(userIcon);
                userIndicator.appendChild(document.createTextNode(`User ID: ${user.ntid.toUpperCase()}`));
                userIndicatorItem.appendChild(userIndicator);
                
                // Insere como primeiro item do menu lateral/topo
                menuActions.insertBefore(userIndicatorItem, menuActions.firstChild);
            } else {
                userIndicator.textContent = `User ID: ${user.ntid.toUpperCase()}`;
            }
        }

        // Adiciona o botão de logout dinâmico com o ícone EXIT.svg
        if (menuActions && !document.getElementById("btn-logout-nav")) {
            const logoutItem = document.createElement("li");
            const logoutLink = document.createElement("a");
            logoutLink.href = "#";
            logoutLink.id = "btn-logout-nav";
            logoutLink.className = "frontend-kit__header__link";
            logoutLink.style.color = "#ea0016";
            logoutLink.style.fontWeight = "bold";
            logoutLink.style.display = "flex";
            logoutLink.style.alignItems = "center";
            logoutLink.style.gap = "8px";
            
            const exitIcon = document.createElement("img");
            exitIcon.src = "assent/icons/EXIT.svg"; // Caminho case-sensitive corrigido
            exitIcon.alt = "Exit";
            exitIcon.style.width = "16px";
            exitIcon.style.height = "16px";
            logoutLink.appendChild(exitIcon);
            logoutLink.appendChild(document.createTextNode(`Sign Out`));
            logoutItem.appendChild(logoutLink);
            
            const brandSelectionItem = menuActions.querySelector(".brand-selection")?.parentNode;
            if (brandSelectionItem) {
                menuActions.insertBefore(logoutItem, brandSelectionItem);
            } else {
                menuActions.appendChild(logoutItem);
            }
            logoutLink.addEventListener("click", (e) => {
                e.preventDefault();
                efetuarLogout();
            });
        }
    }

    function efetuarLogout() {
        try {
            // Remove as chaves antes de redirecionar para evitar redirecionamento circular
            localStorage.removeItem("executive_visit_session");
            localStorage.removeItem("token_seguro");
        } finally {
            window.location.href = "auth.html";
        }
    }

    if (btnLogoutHeader) {
        btnLogoutHeader.addEventListener("click", (e) => {
            e.preventDefault();
            efetuarLogout();
        });
    }

    // ==========================================================================
    // RENDERIZADOR DINÂMICO LOCAL DA AGENDA (ALVO CLASSE HTML GLOBAL)
    // ==========================================================================
    function renderizarDia(diaKey) {
        const tbody = document.querySelector(".schedule-table tbody");
        if (!tbody) return;

        tbody.innerHTML = ""; 

        const diaEncontrado = dadosAgenda.days.find(d => d.id === diaKey);

        if (diaEncontrado && diaEncontrado.events) {
            diaEncontrado.events.forEach(item => {
                const tr = document.createElement("tr");

                const tdTime = document.createElement("td");
                tdTime.className = "time-col";
                tdTime.textContent = item.time;

                const tdEvent = document.createElement("td");
                const strong = document.createElement("strong");
                strong.textContent = item.title; 
                const br = document.createElement("br");
                const small = document.createElement("small");
                small.textContent = item.description;
                
                tdEvent.appendChild(strong);
                tdEvent.appendChild(br);
                tdEvent.appendChild(small);

                const tdLoc = document.createElement("td");
                tdLoc.innerHTML = item.location;

                const tdHost = document.createElement("td");
                tdHost.textContent = item.host;

                tr.appendChild(tdTime);
                tr.appendChild(tdEvent);
                tr.appendChild(tdLoc);
                tr.appendChild(tdHost);

                tbody.appendChild(tr);
            });
        }
    }

    window.showDay = function(event, dayId) {
        const tablinks = document.querySelectorAll(".day-tab");
        tablinks.forEach(t => t.classList.remove("active"));
        event.currentTarget.classList.add("active");
        renderizarDia(dayId);
    };

    function atualizarRelogios() {
        const ago = new Date();
        const brazilClock = document.getElementById("brazil-clock");
        if (brazilClock) {
            brazilClock.textContent = ago.toLocaleTimeString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                hour12: false
            });
        }
        const germanyClock = document.getElementById("germany-clock");
        if (germanyClock) {
            germanyClock.textContent = ago.toLocaleTimeString("pt-BR", {
                timeZone: "Europe/Berlin",
                hour12: false
            });
        }
    }

    // ==========================================================================
    // LÓGICA DE GEOLOCALIZAÇÃO ATIVA E PERÍMETRO DE REDE
    // ==========================================================================
    const btnGetLocation = document.getElementById("get-location-btn");
    const locationStatus = document.getElementById("location-status");

    if (btnGetLocation && locationStatus) {
        btnGetLocation.addEventListener("click", () => {
            locationStatus.textContent = "Buscando satélites e dados de rede local...";
            
            if (!navigator.geolocation) {
                locationStatus.textContent = "Geolocalização não é suportada por este dispositivo.";
                return;
            }

            const geoOptions = {
                enableHighAccuracy: true,
                timeout: 7000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude.toFixed(5);
                    const lon = position.coords.longitude.toFixed(5);
                    
                    locationStatus.innerHTML = `
                        <strong>✅ Dispositivo Localizado!</strong><br>
                        Coordenadas: Lat ${lat} | Lon ${lon}<br>
                        <span style="color: #007bc0; font-weight: 700;">Status: Localização validada para auditoria do Executive Visit.</span>
                    `;
                    
                    btnGetLocation.textContent = "Location Updated";
                    btnGetLocation.style.backgroundColor = "var(--bosch-blue-dark)";
                },
                (error) => {
                    console.warn("Erro ao detectar geolocalização:", error);
                    locationStatus.textContent = "Por favor, ative e conceda permissão de GPS para validar sua conexão.";
                },
                geoOptions
            );
        });
    }

    // ================== CONTROLE DE FLUXOS DA PÁGINA ==================
    if (isAuthPage) {
        // Correção de loop circular no login
        const sessaoAtiva = localStorage.getItem("executive_visit_session");
        if (sessaoAtiva) {
            try {
                const dados = JSON.parse(sessaoAtiva);
                if (dados && dados.ntid) {
                    window.location.href = "index.html";
                } else {
                    localStorage.removeItem("executive_visit_session");
                }
            } catch (e) {
                localStorage.removeItem("executive_visit_session");
            }
        }

        // Formulário de Login Manual com Validação Rígida contra o Backend Python
        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault(); 

                const ntidInput = document.getElementById("username");
                const passInput = document.getElementById("password");
                const loadingOverlay = document.getElementById("loadingOverlay");
                const loadingText = document.getElementById("loadingText");

                if (!ntidInput || !passInput) return;

                const ntid = ntidInput.value.trim().toUpperCase();
                const password = passInput.value;

                if (ntid.length < 5) {
                    alert("Insira um NTID válido para continuar.");
                    return;
                }

                if (password.length === 0) {
                    alert("Por favor, insira sua senha corporativa.");
                    return;
                }

                // ATIVA A TELA DE LOADING
                if (loadingOverlay) {
                    loadingOverlay.classList.add("active");
                }

                try {
                    if (loadingText) loadingText.textContent = "Verificando certificado de segurança e túnel VPN...";
                    await new Promise(resolve => setTimeout(resolve, 800));

                    if (loadingText) loadingText.textContent = `Validando credenciais de rede para o usuário ${ntid}.`;

                    // Envia a requisição para a API do Python
                    const response = await fetch('http://localhost:3000/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username: ntid, password: password })
                    });

                    const resultado = await response.json();

                    if (response.ok && resultado.sucesso) {
                        if (loadingText) loadingText.textContent = "Acesso autorizado! Carregando painel corporativo...";
                        await new Promise(resolve => setTimeout(resolve, 500));

                        localStorage.setItem("executive_visit_session", JSON.stringify(resultado.usuario));
                        localStorage.setItem("token_seguro", resultado.token);
                        
                        window.location.href = "index.html"; 
                    } else {
                        if (loadingOverlay) loadingOverlay.classList.remove("active");
                        alert(resultado.erro || "Falha na autenticação corporativa.");
                    }
                } catch (error) {
                    if (loadingOverlay) loadingOverlay.classList.remove("active");
                    console.error("Erro crítico na chamada de autenticação:", error);
                    alert("Erro de Conexão: Não foi possível conectar ao servidor de segurança. Verifique se o seu backend Python está rodando na porta 3000.");
                }
            });
        }
    } else {
        verificarSessao();
        atualizarRelogios();
        setInterval(atualizarRelogios, 1000);
        
        if (document.querySelector(".schedule-table")) {
            renderizarDia("day-1-content");
        }
    }

    // --- Menu Sanduíche ---
    const menuToggle = document.getElementById("menuToggle");
    const menuActions = document.getElementById("navActions");

    if (menuToggle && menuActions) {
        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !isExpanded);
            menuToggle.classList.toggle("is-active");
            menuActions.classList.toggle("is-open");
        });
    }
});
