const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const darkMode = document.querySelector('.dark-mode');

menuBtn?.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});
closeBtn?.addEventListener('click', () => {
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

darkMode?.addEventListener('click', () => {
    const isNowDark = document.body.classList.toggle('dark-mode-variables');
    const span1 = darkMode.querySelector('span:nth-child(1)');
    const span2 = darkMode.querySelector('span:nth-child(2)');
    span1.classList.toggle('active', isNowDark);
    span2.classList.toggle('active', !isNowDark);
    localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
});

function parseDate(d) {
    const [day, month, year] = d.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

const maxInitialRows = 5;
const tbody = document.querySelector('.recent-orders table tbody');
const toggleLink = document.querySelector('.recent-orders a');
let allOrders = [];
let showingAll = false;

function renderOrders(data, limit = null) {
    tbody.innerHTML = '';
    const rowsToShow = limit ? data.slice(0, limit) : data;

    rowsToShow.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.date ?? '--'}</td>
            <td>${order.ph ?? '--'}</td>
            <td>
                ${order.color ?? '--'} mg Pt/L
                <span class="tooltip-icon">?
                    <span class="tooltip-text">Cor em miligramas de platina por litro</span>
                </span>
            </td>
            <td>
                ${order.turbidity ?? '--'} NTU
                <span class="tooltip-icon">?
                    <span class="tooltip-text">Turbidez em unidades nefelométricas (NTU)</span>
                </span>
            </td>
            <td>
                ${order.st ?? '--'} mg/L
                <span class="tooltip-icon">?
                    <span class="tooltip-text">ST: Sólidos Totais em miligramas por litro</span>
                </span>
            </td>
            <td>
                ${order.stv ?? '--'} mg/L
                <span class="tooltip-icon">?
                    <span class="tooltip-text">STV: Sólidos Totais Voláteis em miligramas por litro</span>
                </span>
            </td>
            <td>
                ${order.stf ?? '--'} mg/L
                <span class="tooltip-icon">?
                    <span class="tooltip-text">STF: Sólidos Totais Fixos em miligramas por litro</span>
                </span>
            </td>
            <td>
                ${order.temperature ?? '--'} °C
                <span class="tooltip-icon">?
                    <span class="tooltip-text">Temperatura em graus Celsius</span>
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

fetch('https://raw.githubusercontent.com/GhostDev-Creator/Dados/refs/heads/main/agua.json')
    .then(response => response.json())
    .then(data => {
        const sortedDataAsc = [...data].sort((a, b) => parseDate(a.date) - parseDate(b.date));

        const lastEntry = sortedDataAsc[sortedDataAsc.length - 1] || {};

        document.getElementById('phNow').textContent = `${lastEntry.ph ?? '--'}`;
        document.getElementById('turbidezNow').textContent = `${lastEntry.turbidity ?? '--'} NTU`;
        document.getElementById('corNow').textContent = `${lastEntry.color ?? '--'} uH`;

        document.getElementById('phPercent').textContent = `${lastEntry.ph ?? '--'}`;
        document.getElementById('turbidezPercent').textContent = `${lastEntry.turbidity ?? '--'} NTU`;
        document.getElementById('corPercent').textContent = `${lastEntry.color ?? '--'} uH`;

        const labels = sortedDataAsc.map(d => d.date);
        const st = sortedDataAsc.map(d => d.st ?? null);
        const stv = sortedDataAsc.map(d => d.stv ?? null);
        const stf = sortedDataAsc.map(d => d.stf ?? null);

        const ctx = document.getElementById('phChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'ST',
                        data: st,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2
                    },
                    {
                        label: 'STV',
                        data: stv,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2
                    },
                    {
                        label: 'STF',
                        data: stf,
                        borderColor: 'rgb(54, 235, 81)',
                        backgroundColor: 'rgba(54, 235, 60, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        borderWidth: 2
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
                                const parts = val.toString().split('.');
                                if (parts.length === 1) return `${context.dataset.label}: ${val}`;
                                const decimal = parts[1].replace(/0+$/, '');
                                const casas = decimal.length;
                                return `${context.dataset.label}: ${parseFloat(val).toFixed(casas)}`;
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
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Concentração (mg/L)'
                        }
                    }
                }
            }
        });

        allOrders = [...data].sort((a, b) => parseDate(b.date) - parseDate(a.date));
        renderOrders(allOrders, maxInitialRows);
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));

toggleLink.addEventListener('click', event => {
    event.preventDefault();
    if (showingAll) {
        renderOrders(allOrders, maxInitialRows);
        toggleLink.textContent = 'Mostrar Tudo';
        showingAll = false;
    } else {
        renderOrders(allOrders);
        toggleLink.textContent = 'Mostrar Menos';
        showingAll = true;
    }
});
