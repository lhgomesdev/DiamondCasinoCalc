const gameData = {
    targets: [
        { id: "cash", name: "Dinheiro", icon: "fa-money-bill", valNormal: 2115000, valHard: 2326500 },
        { id: "artwork", name: "Arte", icon: "fa-palette", valNormal: 2350000, valHard: 2585000 },
        { id: "gold", name: "Ouro", icon: "fa-bars", valNormal: 2585000, valHard: 2843500 },
        { id: "diamonds", name: "Diamantes", icon: "fa-gem", valNormal: 3290000, valHard: 3619000 }
    ],
    crew: {
        hacker: [
            { name: "Avi Schwartzman (10%)", cut: 0.10 },
            { name: "Paige Harris (9%)", cut: 0.09 },
            { name: "Christian Feltz (7%)", cut: 0.07 },
            { name: "Yohan Blair (5%)", cut: 0.05 },
            { name: "Rickie Luckens (3%)", cut: 0.03 }
        ],
        gunman: [
            { name: "Chester McCoy (10%)", cut: 0.10 },
            { name: "Gustavo Mota (9%)", cut: 0.09 },
            { name: "Patrick McReary (8%)", cut: 0.08 },
            { name: "Charlie Reed (7%)", cut: 0.07 },
            { name: "Karl Abolaji (5%)", cut: 0.05 }
        ],
        driver: [
            { name: "Chester McCoy (10%)", cut: 0.10 },
            { name: "Eddie Toh (9%)", cut: 0.09 },
            { name: "Taliana Martinez (7%)", cut: 0.07 },
            { name: "Zach Nelson (6%)", cut: 0.06 },
            { name: "Karim Denz (5%)", cut: 0.05 }
        ]
    }
};

let state = {
    targetId: 'artwork',
    isHard: true,
    isElite: false,
    buyerLevel: 'high',
    crew: {
        hacker: 0.09,
        gunman: 0.05,
        driver: 0.05
    },
    playerCount: 2,
    players: [
        { id: 1, name: "Você (Host)", cut: 50, isHost: true },
        { id: 2, name: "Player 2", cut: 50, isHost: false },
        { id: 3, name: "Player 3", cut: 15, isHost: false },
        { id: 4, name: "Player 4", cut: 15, isHost: false }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    setPlayers(2);
    updateCalculations();
});

function initUI() {
    // 1. Gerar Botões de Alvo
    const targetContainer = document.getElementById('target-options');
    gameData.targets.forEach(t => {
        const btn = document.createElement('div');
        // As classes de estilo são aplicadas dinamicamente na função selectTarget
        btn.innerHTML = `<i class="fas ${t.icon} text-xl mb-1"></i>${t.name}`;
        btn.onclick = () => selectTarget(t.id, btn);
        targetContainer.appendChild(btn);
    });
    // Seleciona o alvo inicial visualmente
    // (A função updateCalculations cuidará dos valores, mas precisamos marcar o botão)
    const initialBtn = targetContainer.children[1]; // Arte é o índice 1
    if(initialBtn) selectTarget('artwork', initialBtn);


    // 2. Preencher Selects da Equipe
    populateSelect('hacker-select', gameData.crew.hacker, 0.09);
    populateSelect('gunman-select', gameData.crew.gunman, 0.05);
    populateSelect('driver-select', gameData.crew.driver, 0.05);

    // 3. Adicionar Listeners de Eventos
    document.getElementById('hard-mode').addEventListener('change', (e) => {
        state.isHard = e.target.checked;
        updateCalculations();
    });

    document.getElementById('elite-mode').addEventListener('change', (e) => {
        state.isElite = e.target.checked;
        updateCalculations();
    });

    ['hacker', 'gunman', 'driver'].forEach(role => {
        document.getElementById(`${role}-select`).addEventListener('change', (e) => {
            state.crew[role] = parseFloat(e.target.value);
            updateCalculations();
        });
    });
}

function selectTarget(id, btnElement) {
    state.targetId = id;

    const allBtns = document.getElementById('target-options').children;
    for (let btn of allBtns) {
        btn.className = 'target-btn p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 text-sm font-bold text-center border-gray-700 bg-gray-800 text-gray-500 hover:bg-gray-700 hover:border-gray-600';
    }

    btnElement.className = 'target-btn p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 text-sm font-bold text-center border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)] scale-[1.02]';

    updateCalculations();
}

window.setBuyer = function(level) {
    state.buyerLevel = level;

    document.querySelectorAll('.buyer-btn').forEach(btn => {
        btn.removeAttribute('data-active');
    });

    const activeBtn = document.querySelector(`.buyer-btn[data-level="${level}"]`);
    if(activeBtn) activeBtn.setAttribute('data-active', 'true');

    updateCalculations();
}

window.setPlayers = function(num) {
    state.playerCount = num;

    document.querySelectorAll('.p-btn').forEach(btn => {
        if(parseInt(btn.dataset.count) === num) {
            btn.className = "p-btn px-4 py-1 rounded text-sm font-bold bg-gold text-black shadow-lg transform scale-105 transition-all";
        } else {
            btn.className = "p-btn px-4 py-1 rounded text-sm font-bold text-gray-500 hover:text-white transition-colors bg-transparent";
        }
    });

    if(num === 2) { state.players[0].cut = 50; state.players[1].cut = 50; }
    if(num === 3) { state.players[0].cut = 40; state.players[1].cut = 30; state.players[2].cut = 30; }
    if(num === 4) { state.players[0].cut = 25; state.players[1].cut = 25; state.players[2].cut = 25; state.players[3].cut = 25; }

    renderPlayers();
    updateCalculations();
}

function renderPlayers() {
    const container = document.getElementById('players-container');
    container.innerHTML = '';

    for (let i = 0; i < state.playerCount; i++) {
        const p = state.players[i];
        const row = document.createElement('div');
        row.className = 'bg-gray-800/50 p-3 rounded-lg border border-gray-700';
        row.innerHTML = `
            <div class="flex justify-between items-center mb-2 text-sm">
                <span class="font-bold text-gray-200">${p.name}</span>
                <span class="font-bold text-gold" id="disp-pct-${i}">${p.cut}%</span>
            </div>
            <input type="range" min="15" max="100" step="5" value="${p.cut}" 
                class="range-slider"
                oninput="updatePlayerCut(${i}, this.value)">
        `;
        container.appendChild(row);
    }
}

window.updatePlayerCut = function(index, value) {
    state.players[index].cut = parseInt(value);
    document.getElementById(`disp-pct-${index}`).innerText = value + '%';
    updateCalculations();
}

function populateSelect(id, options, defaultValue) {
    const select = document.getElementById(id);
    options.forEach(opt => {
        const el = document.createElement('option');
        el.value = opt.cut;
        el.innerText = opt.name;
        if(opt.cut === defaultValue) el.selected = true;
        select.appendChild(el);
    });
}

function formatMoney(val) {
    return "$ " + val.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function updateCalculations() {
    const targetData = gameData.targets.find(t => t.id === state.targetId);
    const maxVal = state.isHard ? targetData.valHard : targetData.valNormal;

    let buyerFeePct = 0;
    if (state.buyerLevel === 'mid') buyerFeePct = 0.05; // 5%
    if (state.buyerLevel === 'low') buyerFeePct = 0.10; // 10%

    const buyerFeeAmount = maxVal * buyerFeePct;

    const lesterCut = 0.05;
    const crewTotalCut = state.crew.hacker + state.crew.gunman + state.crew.driver;
    const totalDeductionPct = lesterCut + crewTotalCut;

    const deductionAmount = maxVal * totalDeductionPct;

    const netTake = maxVal - buyerFeeAmount - deductionAmount;

    const eliteBonus = state.isElite ? 100000 : 0; // Adiciona no final

    document.getElementById('val-gross').innerText = formatMoney(maxVal);
    document.getElementById('val-buyer-fee').innerText = "- " + formatMoney(buyerFeeAmount);
    document.getElementById('val-deductions').innerText = "- " + formatMoney(deductionAmount);
    document.getElementById('val-elite').innerText = state.isElite ? "+ $ 100,000" : "$ 0";

    const payoutsList = document.getElementById('final-payouts-list');
    payoutsList.innerHTML = '';
    let totalPct = 0;

    for(let i = 0; i < state.playerCount; i++) {
        const p = state.players[i];
        totalPct += p.cut;

        const sharePct = p.cut / 100;

        let playerShare = (netTake * sharePct);

        if (playerShare < 0) playerShare = 0;

        playerShare += eliteBonus;

        const row = document.createElement('div');
        row.className = `flex justify-between items-center ${p.isHost ? 'text-gold font-bold text-lg' : 'text-gray-300 text-base'}`;
        row.innerHTML = `
            <span>${p.name} ${p.isHost ? '<i class="fas fa-crown ml-1 text-xs"></i>' : ''}</span>
            <span>${formatMoney(playerShare)}</span>
        `;
        payoutsList.appendChild(row);
    }

    const totalDisplay = document.getElementById('total-split-display');
    totalDisplay.innerText = totalPct + "%";
    if (totalPct !== 100) {
        totalDisplay.className = 'text-red-500 font-bold';
    } else {
        totalDisplay.className = 'text-green-500 font-bold';
    }
}