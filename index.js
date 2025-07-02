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
        <td>${order.date}</td>
        <td>${order.ph}</td>
        <td>
          ${order.color} mg Pt/L
          <span class="tooltip-icon">?
            <span class="tooltip-text">Cor em miligramas de platina por litro</span>
          </span>
        </td>
        <td>
          ${order.turbidity} NTU
          <span class="tooltip-icon">?
            <span class="tooltip-text">Turbidez em unidades nefelométricas (NTU)</span>
          </span>
        </td>
        <td>
          ${order.st} mg/L
          <span class="tooltip-icon">?
            <span class="tooltip-text">ST: Sólidos Totais em miligramas por litro</span>
          </span>
        </td>
        <td>
          ${order.stv} mg/L
          <span class="tooltip-icon">?
            <span class="tooltip-text">STV: Sólidos Totais Voláteis em miligramas por litro</span>
          </span>
        </td>
        <td>
          ${order.stf} mg/L
          <span class="tooltip-icon">?
            <span class="tooltip-text">STF: Sólidos Totais Fixos em miligramas por litro</span>
          </span>
        </td>
        <td>
          ${order.temperature} °C
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
        allOrders = data;
        renderOrders(allOrders, maxInitialRows);

        const last = data[data.length - 1];

        document.getElementById('phNow').textContent = last.ph;
        document.getElementById('turbidezNow').textContent = last.turbidity;
        document.getElementById('corNow').textContent = last.color;

        document.getElementById('phPercent').textContent = `${((last.ph / 14) * 100).toFixed(2)}%`;
        document.getElementById('turbidezPercent').textContent = `${((last.turbidity / 100) * 100).toFixed(2)}%`;
        document.getElementById('corPercent').textContent = `${((last.color / 720) * 100).toFixed(2)}%`;
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
