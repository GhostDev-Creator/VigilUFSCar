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

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';

    document.body.classList.toggle('dark-mode-variables', isDark);

    const span1 = darkMode.querySelector('span:nth-child(1)');
    const span2 = darkMode.querySelector('span:nth-child(2)');

    span1.classList.toggle('active', isDark);
    span2.classList.toggle('active', !isDark);
}

applySavedTheme();

darkMode.addEventListener('click', () => {
    const isNowDark = document.body.classList.toggle('dark-mode-variables');

    const span1 = darkMode.querySelector('span:nth-child(1)');
    const span2 = darkMode.querySelector('span:nth-child(2)');
    span1.classList.toggle('active', isNowDark);
    span2.classList.toggle('active', !isNowDark);

    localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
});

function parseDate(d) {
    const [day, month, year] = d.split('/');
    const fullYear = parseInt(year.length === 2 ? `20${year}` : year);
    return new Date(fullYear, parseInt(month) - 1, parseInt(day));
}

const maxInitialRows = 5;
const tbody = document.querySelector('.recent-orders table tbody');
const toggleLink = document.querySelector('.recent-orders a');
let allData = [];
let showingAll = false;

function renderOrders(data, limit = null) {
    tbody.innerHTML = '';
    const rowsToShow = limit ? data.slice(0, limit) : data;

    rowsToShow.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.date ?? '--'}</td>
            <td>${entry.timeUTC ?? '--'}</td>
            <td>${entry.precipitation_mm ?? '--'}</td>
            <td>${entry.humidity_percent ?? '--'}</td>
            <td>${entry.pressure_hPa ?? '--'}</td>
            <td>${entry.windSpeed_mps ?? '--'}</td>
            <td>${entry.temperature_now_C ?? '--'}</td>
            <td>${entry.temperature_max_C ?? '--'} / ${entry.temperature_min_C ?? '--'}</td>
        `;
        tbody.appendChild(tr);
    });
}

const url = 'https://raw.githubusercontent.com/GhostDev-Creator/Dados/refs/heads/main/chuva.json';

fetch(url)
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => parseDate(a.date) - parseDate(b.date));

        const labels = data.map(d => d.date);
        const temperature = data.map(d => d.temperature_now_C);
        const humidity = data.map(d => d.humidity_percent);
        const radiation = data.map(d => parseFloat((d.radiation_wm2 ?? 0).toString().replace(',', '.')));
        const precipitation = data.map(d => d.precipitation_mm);

        const lastEntry = data[data.length - 1] || {};

        document.getElementById('currentTemp').textContent = `${lastEntry.temperature_now_C ?? '--'} °C`;
        document.getElementById('currentHumidity').textContent = `${lastEntry.humidity_percent ?? '--'} %`;
        document.getElementById('currentWindSpeed').textContent = `${lastEntry.windSpeed_mps ?? '--'} m/s`;

        document.getElementById('tempPercentage').textContent = `${lastEntry.temperature_now_C ?? '--'} °C`;
        document.getElementById('humidityPercentage').textContent = `${lastEntry.humidity_percent ?? '--'} %`;
        document.getElementById('windSpeedPercentage').textContent = `${lastEntry.windSpeed_mps ?? '--'} m/s`;

        const ctx = document.getElementById('phChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperatura',
                        data: temperature,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2,
                        yAxisID: 'yTemperature'
                    },
                    {
                        label: 'Umidade',
                        data: humidity,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2,
                        yAxisID: 'yHumidity'
                    },
                    {
                        label: 'Radiação',
                        data: radiation,
                        borderColor: 'rgba(255, 206, 86, 1)',
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2,
                        yAxisID: 'yRadiation'
                    },
                    {
                        label: 'Precipitação',
                        data: precipitation,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2,
                        yAxisID: 'yPrecipitation'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                stacked: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const val = context.raw;
                                if (val === null || val === undefined) return 'Sem dados';
                                let formattedVal = parseFloat(val).toFixed(2);

                                if (context.dataset.label === 'Temperatura') {
                                    formattedVal = `${parseFloat(val).toFixed(1)}°C`;
                                } else if (context.dataset.label === 'Umidade') {
                                    formattedVal = `${parseFloat(val).toFixed(0)}%`;
                                } else if (context.dataset.label === 'Radiação') {
                                    formattedVal = `${parseFloat(val).toFixed(2)} W/m²`;
                                } else if (context.dataset.label === 'Precipitação') {
                                    formattedVal = `${parseFloat(val).toFixed(1)} mm`;
                                }
                                return `${context.dataset.label}: ${formattedVal}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data (DD/MM/AAAA)'
                        }
                    },
                    yTemperature: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Temp. (°C)'
                        },
                        min: 20,
                        max: 40,
                        ticks: {
                            callback: value => `${value}°`
                        }
                    },
                    yHumidity: {
                        type: 'linear',
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: {
                            display: true,
                            text: 'Umid. (%)'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: value => `${value}%`
                        }
                    },
                    yRadiation: {
                        type: 'linear',
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: {
                            display: true,
                            text: 'Radiação (W/m²)'
                        },
                        min: 0,
                        max: 2500,
                        ticks: {
                            callback: value => `${value}`
                        }
                    },
                    yPrecipitation: {
                        type: 'linear',
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: {
                            display: true,
                            text: 'Precip. (mm)'
                        },
                        min: 0,
                        max: 50,
                        ticks: {
                            callback: value => `${value}`
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Erro ao carregar dados climáticos:', error);
    });

fetch('https://raw.githubusercontent.com/GhostDev-Creator/Dados/refs/heads/main/chuva.json')
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => parseDate(b.date) - parseDate(a.date));

        allData = data;
        renderOrders(allData, maxInitialRows);
    })
    .catch(error => console.error('Erro ao carregar os dados meteorológicos para a tabela:', error));

toggleLink.addEventListener('click', event => {
    event.preventDefault();
    if (showingAll) {
        renderOrders(allData, maxInitialRows);
        toggleLink.textContent = 'Mostrar Tudo';
        showingAll = false;
    } else {
        renderOrders(allData);
        toggleLink.textContent = 'Mostrar Menos';
        showingAll = true;
    }
});