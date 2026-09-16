/**
 * BOSCH BRAZIL - EXECUTIVE VISIT
 * page.js - Relógios mundiais, geolocalização, abas e navegação
 */

// =============================================================
// 1. LÓGICA DO RELÓGIO (BRASIL E ALEMANHA)
// =============================================================
function updateClocks() {
    var brazilEl = document.getElementById('brazil-clock');
    var germanyEl = document.getElementById('germany-clock');

    if (!brazilEl || !germanyEl) return;

    var now = new Date();

    var timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    var brazilTime = new Intl.DateTimeFormat('pt-BR', {
        ...timeOptions,
        timeZone: 'America/Sao_Paulo'
    }).format(now);
    brazilEl.textContent = brazilTime;

    var germanyTime = new Intl.DateTimeFormat('de-DE', {
        ...timeOptions,
        timeZone: 'Europe/Berlin'
    }).format(now);
    germanyEl.textContent = germanyTime;
}

// =============================================================
// 2. LÓGICA DA GEOLOCALIZAÇÃO
// =============================================================
function initGeolocation() {
    var locationButton = document.getElementById('get-location-btn');
    var locationStatus = document.getElementById('location-status');

    if (!locationButton || !locationStatus) return;

    locationButton.addEventListener('click', function () {
        if ('geolocation' in navigator) {
            locationStatus.textContent = 'Obtendo sua localização...';
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    locationStatus.innerHTML = 
                        '<strong>Latitude:</strong> ' + lat.toFixed(5) + ' | ' +
                        '<strong>Longitude:</strong> ' + lng.toFixed(5) + '<br>' +
                        '<a href="https://www.google.com/maps?q=' + lat + ',' + lng + '" target="_blank" rel="noopener noreferrer" class="bosch-btn-secondary-link" style="display:inline-block;margin-top:0.5rem;">Ver sua localização no Google Maps &rarr;</a>';
                },
                function (error) {
                    var msg = '';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            msg = 'Você negou a permissão para acessar sua localização.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            msg = 'Informação de localização indisponível.';
                            break;
                        case error.TIMEOUT:
                            msg = 'A solicitação de localização expirou.';
                            break;
                        default:
                            msg = 'Ocorreu um erro ao obter a localização.';
                            break;
                    }
                    locationStatus.textContent = msg;
                }
            );
        } else {
            locationStatus.textContent = 'Geolocalização não é suportada pelo seu navegador.';
        }
    });
}

// =============================================================
// 3. ABAS DO CRONOGRAMA
// =============================================================
function showDay(evt, dayId) {
    var daycontent = document.getElementsByClassName("day-content");
    for (var i = 0; i < daycontent.length; i++) {
        daycontent[i].style.display = "none";
    }

    var daytabs = document.getElementsByClassName("day-tab");
    for (var j = 0; j < daytabs.length; j++) {
        daytabs[j].className = daytabs[j].className.replace(" active", "");
    }

    var targetDay = document.getElementById(dayId);
    if (targetDay) {
        targetDay.style.display = "block";
    }
    if (evt && evt.currentTarget) {
        evt.currentTarget.className += " active";
    }
}

// =============================================================
// 4. MENU HAMBÚRGUER
// =============================================================
function toggleNavMenu() {
    var nav = document.getElementById("navActions");
    var btn = document.getElementById("menuToggle");
    if (!nav || !btn) return;

    var isOpen = nav.classList.toggle("is-open");
    btn.classList.toggle("is-active", isOpen);
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function closeNavMenu() {
    var nav = document.getElementById("navActions");
    var btn = document.getElementById("menuToggle");
    if (nav && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
    }
    if (btn && btn.classList.contains("is-active")) {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-expanded", "false");
    }
}

document.addEventListener("click", function (event) {
    var header = document.querySelector(".frontend-kit__header");
    if (header && !header.contains(event.target)) {
        closeNavMenu();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    updateClocks();
    setInterval(updateClocks, 1000);
    initGeolocation();
});