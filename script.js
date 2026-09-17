/**
 * BOSCH BRAZIL - EXECUTIVE VISIT
 * script.js - Relógios mundiais, GPS, menu e alternância de dias
 */

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

function showDay(evt, dayId) {
    if (evt && evt.preventDefault) {
        evt.preventDefault();
    }

    // Esconde todas as tabelas
    var daycontent = document.querySelectorAll(".day-content");
    daycontent.forEach(function (content) {
        content.style.display = "none";
    });

    // Remove active de todos os botões
    var daytabs = document.querySelectorAll(".day-tab");
    daytabs.forEach(function (tab) {
        tab.classList.remove("active");
    });

    // Mostra o dia selecionado
    var targetDay = document.getElementById(dayId);
    if (targetDay) {
        targetDay.style.display = "block";
    }

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }
}

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

function loadDynamicSchedule() {
    var scheduleSection = document.getElementById('schedule');
    if (!scheduleSection) return;

    var cacheBusterUrl = 'agenda.json?_t=' + new Date().getTime();

    fetch(cacheBusterUrl, {
        cache: 'no-store',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    })
    .then(function (response) {
        if (!response.ok) {
            throw new Error('Status ' + response.status);
        }
        return response.json();
    })
    .then(function (data) {
        if (!data || !data.days || !Array.isArray(data.days) || data.days.length === 0) {
            return;
        }

        renderScheduleFromData(data);
    })
    .catch(function (error) {
        // Fallback ativo direto nas tabelas do index.html
    });
}

function renderScheduleFromData(data) {
    var scheduleSection = document.getElementById('schedule');
    if (!scheduleSection) return;

    var oldTabs = scheduleSection.querySelector('.day-selector');
    if (oldTabs) oldTabs.remove();

    var oldTables = scheduleSection.querySelectorAll('.schedule-table-wrapper');
    oldTables.forEach(function (el) { el.remove(); });

    var daySelector = document.createElement('div');
    daySelector.className = 'day-selector';

    data.days.forEach(function (day, index) {
        var btn = document.createElement('button');
        btn.className = 'day-tab' + (index === 0 ? ' active' : '');
        btn.textContent = day.tabTitle || ('Day ' + (index + 1));
        btn.onclick = function (e) {
            showDay(e, day.id);
        };
        daySelector.appendChild(btn);
    });

    scheduleSection.appendChild(daySelector);

    data.days.forEach(function (day, index) {
        var wrapper = document.createElement('div');
        wrapper.id = day.id;
        wrapper.className = 'schedule-table-wrapper day-content';
        if (index > 0) {
            wrapper.style.display = 'none';
        }

        var table = document.createElement('table');
        table.className = 'schedule-table';

        var thead = document.createElement('thead');
        thead.innerHTML = 
            '<tr>' +
                '<th>Time</th>' +
                '<th>Event / Activity</th>' +
                '<th>Location</th>' +
                '<th>Host / Lead</th>' +
            '</tr>';
        table.appendChild(thead);

        var tbody = document.createElement('tbody');

        if (day.events && Array.isArray(day.events)) {
            day.events.forEach(function (ev) {
                var tr = document.createElement('tr');
                if (ev.highlight) {
                    tr.className = 'highlight-row';
                }

                var tdTime = document.createElement('td');
                tdTime.className = 'time-col';
                tdTime.textContent = ev.time || '';

                var tdEvent = document.createElement('td');
                var strong = document.createElement('strong');
                strong.textContent = ev.title || '';
                tdEvent.appendChild(strong);

                if (ev.description) {
                    var small = document.createElement('small');
                    small.textContent = ev.description;
                    tdEvent.appendChild(small);
                }

                var tdLoc = document.createElement('td');
                tdLoc.textContent = ev.location || '';

                var tdHost = document.createElement('td');
                tdHost.textContent = ev.host || '';

                tr.appendChild(tdTime);
                tr.appendChild(tdEvent);
                tr.appendChild(tdLoc);
                tr.appendChild(tdHost);

                tbody.appendChild(tr);
            });
        }

        table.appendChild(tbody);
        wrapper.appendChild(table);
        scheduleSection.appendChild(wrapper);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateClocks();
    setInterval(updateClocks, 1000);
    initGeolocation();
    loadDynamicSchedule();
});