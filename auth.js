/* ==========================================================================
   BOSCH EXECUTIVE VISIT - AUTHENTICATION & ACCESS CONTROL (auth.js)
   ========================================================================== */

(function () {
    "use strict";

    // Hash SHA-256 para a chave padrão: "Bosch2026@"
    // Para gerar novo hash: console.log(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("NOVA_SENHA")))
    const EXPECTED_HASH = "81c3c4e532b26027a44fbc752d5b6ee7885b5420d433b9ef6ee8d7c4a1b02137";
    const SESSION_KEY = "bosch_visit_authenticated";

    // Função utilitária de hashing SHA-256 nativa (Web Crypto API)
    async function sha256(str) {
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    function isAlreadyAuthenticated() {
        return sessionStorage.getItem(SESSION_KEY) === "true";
    }

    function createAuthModal() {
        if (document.getElementById("bosch-auth-overlay")) return;

        // Estilo injetado diretamente para garantir bloqueio imediato antes do CSS carregar
        const style = document.createElement("style");
        style.id = "bosch-auth-style";
        style.innerHTML = `
            #bosch-auth-overlay {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: #1f1f1f;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: "Bosch Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                padding: 1.5rem;
                box-sizing: border-box;
            }
            .auth-card {
                background: #ffffff;
                width: 100%;
                max-width: 440px;
                padding: 2.5rem 2rem;
                border-radius: 4px;
                box-shadow: 0 12px 32px rgba(0,0,0,0.3);
                text-align: center;
                box-sizing: border-box;
                border-top: 4px solid #007bc0;
            }
            .auth-card__tag {
                display: inline-block;
                background: #eff5f9;
                color: #007bc0;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding: 0.35rem 0.75rem;
                border-radius: 2px;
                margin-bottom: 1rem;
            }
            .auth-card h2 {
                margin: 0 0 0.5rem 0;
                font-size: 1.6rem;
                color: #1f1f1f;
            }
            .auth-card p {
                margin: 0 0 1.75rem 0;
                font-size: 0.95rem;
                color: #5c6670;
                line-height: 1.5;
            }
            .auth-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .auth-input {
                width: 100%;
                padding: 0.85rem 1rem;
                border: 1px solid #d7e1e6;
                border-radius: 4px;
                font-size: 1rem;
                box-sizing: border-box;
                outline: none;
                transition: border-color 0.2s;
            }
            .auth-input:focus {
                border-color: #007bc0;
                box-shadow: 0 0 0 2px rgba(0, 123, 192, 0.2);
            }
            .auth-btn {
                background-color: #007bc0;
                color: #ffffff;
                border: none;
                padding: 0.85rem 1.5rem;
                font-size: 1rem;
                font-weight: 700;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .auth-btn:hover {
                background-color: #005a9c;
            }
            .auth-error {
                margin-top: 0.75rem;
                font-size: 0.85rem;
                color: #ea0016;
                font-weight: 600;
                display: none;
            }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement("div");
        overlay.id = "bosch-auth-overlay";
        overlay.innerHTML = `
            <div class="auth-card">
                <span class="auth-card__tag">Confidential · Executive Access</span>
                <h2>Restricted Portal</h2>
                <p>Please enter the access code provided for the Executive Visit to unlock the agenda and logistics.</p>
                <form class="auth-form" id="bosch-auth-form" onsubmit="return false;">
                    <input type="password" id="bosch-auth-input" class="auth-input" placeholder="Access code" autocomplete="current-password" required />
                    <button type="submit" id="bosch-auth-btn" class="auth-btn">Unlock Visit Schedule</button>
                    <div id="bosch-auth-error" class="auth-error">Incorrect access code. Please try again.</div>
                </form>
            </div>
        `;
        document.body.appendChild(overlay);

        const form = document.getElementById("bosch-auth-form");
        const input = document.getElementById("bosch-auth-input");
        const error = document.getElementById("bosch-auth-error");

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            const typedVal = input.value.trim();
            const typedHash = await sha256(typedVal);

            // Permite validação direta pelo hash ou pela senha padrão
            if (typedHash === EXPECTED_HASH || typedVal === "Bosch2026@") {
                sessionStorage.setItem(SESSION_KEY, "true");
                overlay.remove();
                style.remove();
            } else {
                error.style.display = "block";
                input.value = "";
                input.focus();
            }
        });

        // Foco inicial automático
        setTimeout(() => input.focus(), 100);
    }

    // Executa verificação assim que a página é carregada
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            if (!isAlreadyAuthenticated()) {
                createAuthModal();
            }
        });
    } else {
        if (!isAlreadyAuthenticated()) {
            createAuthModal();
        }
    }
})();
