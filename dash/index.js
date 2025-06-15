const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
});

const maxClimateRows = 5;
const tbody = document.querySelector('.recent-orders table tbody'); // Corrigido
const toggleLink = document.querySelector('.recent-orders a'); // Corrigido

let ClimateMeasurements = [];
let showingAll = false;

function renderClimate(data, limit = null) {
    tbody.innerHTML = '';

    const toRender = limit ? data.slice(0, limit) : data;

    toRender.forEach(measurement => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${measurement.date}</td>
            <td>${measurement.timeUTC}</td>
            <td>${measurement.precipitation_mm} mm</td>
            <td>${measurement.humidity_percent} %</td>
            <td>${measurement.pressure_hPa} hPa</td>
            <td>${measurement.windSpeed_mps} m/s</td>
            <td>${measurement.temperature_now_C} °C</td>
            <td>${measurement.temperature_max_C} °C</td>
            <td>${measurement.temperature_min_C} °C</td>
        `;
        tbody.appendChild(tr);
    });
}

fetch('https://raw.githubusercontent.com/GhostDev-Creator/Dados/main/chuva.json')
  .then(response => response.json())
  .then(data => {
    console.log('Dados recebidos:', data); // Verifique se os dados aparecem corretamente no console
    ClimateMeasurements = data;
    renderClimate(ClimateMeasurements, maxClimateRows);
  })
  .catch(err => console.error('Erro ao carregar dados climáticos:', err));

toggleLink.addEventListener('click', (event) => {
    event.preventDefault();

    if (showingAll) {
        renderClimate(ClimateMeasurements, maxClimateRows);
        toggleLink.textContent = 'Mostrar Tudo';
    } else {
        renderClimate(ClimateMeasurements);
        toggleLink.textContent = 'Mostrar Menos';
    }

    showingAll = !showingAll;
});