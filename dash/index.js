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
    return new Date(`${year}-${month}-${day}`);
}

const url = 'https://raw.githubusercontent.com/GhostDev-Creator/Dados/refs/heads/main/chuva.json';

fetch(url)
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => parseDate(a.date) - parseDate(b.date));

        const labels = data.map(d => d.date);
        const windSpeed_mps = data.map(d => d.windSpeed_mps);
        const humidityValues = data.map(d => d.humidity_percent);
        const pressure_hPa = data.map(d => d.pressure_hPa);

        const lastIndex = data.length - 1;
        const lastTemp = data[lastIndex].temperature_now_C || '--';
        const lastHumidity = data[lastIndex].humidity_percent || '--';
        const lastWind = data[lastIndex].windSpeed_mps || '--';

        document.getElementById('currentTemp').textContent = `${lastTemp} °C`;
        document.getElementById('currentHumidity').textContent = `${lastHumidity}%`;
        document.getElementById('currentWindSpeed').textContent = `${lastWind} m/s`;

        // Sem fórmulas de conversão — exibe o valor real com unidade
        document.getElementById('tempPercentage').textContent = isNaN(lastTemp) ? '--' : `${lastTemp} °C`;
        document.getElementById('humidityPercentage').textContent = isNaN(lastHumidity) ? '--' : `${lastHumidity}%`;
        document.getElementById('windSpeedPercentage').textContent = isNaN(lastWind) ? '--' : `${lastWind} m/s`;

        const ctx = document.getElementById('phChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Pressão (hPa)',
                        data: pressure_hPa,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2,
                        yAxisID: 'yPressure'
                    },
                    {
                        label: 'Umidade (%)',
                        data: humidityValues,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2,
                        yAxisID: 'yHumidity'
                    },
                    {
                        label: 'Vento (m/s)',
                        data: windSpeed_mps,
                        borderColor: 'rgb(54, 235, 81)',
                        backgroundColor: 'rgba(54, 235, 60, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2,
                        yAxisID: 'yWind'
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
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data (DD/MM/AAAA)'
                        }
                    },
                    yPressure: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Pressão (hPa)'
                        },
                        min: 923,
                        max: 929
                    },
                    yHumidity: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: false,
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Umidade (%)'
                        },
                        min: 30,
                        max: 65
                    },
                    yWind: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Vento (m/s)'
                        },
                        min: 0,
                        max: 3,
                        ticks: {
                            padding: 20
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Erro ao carregar dados climáticos:', error);
    });
