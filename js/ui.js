const ui = {
    init: function() {
        this.renderTargets();
        this.populateSelects();
        this.renderHackerLegend();
        this.setupListeners();
        this.setPlayers(2);
        this.update();
    },

    renderTargets: function() {
        const targetContainer = document.getElementById('target-options');
        gameData.targets.forEach(t => {
            const btn = document.createElement('div');
            btn.innerHTML = `<i class="fas ${t.icon} text-xl mb-1"></i>${t.name}`;
            btn.onclick = () => this.selectTarget(t.id, btn);
            targetContainer.appendChild(btn);
        });
        if (targetContainer.children[1]) {
            this.selectTarget('artwork', targetContainer.children[1]);
        }
    },

    populateSelects: function() {
        this.fillSelect('hacker-select', gameData.crew.hacker, 0.09);
        this.fillSelect('gunman-select', gameData.crew.gunman, 0.05);
        this.fillSelect('driver-select', gameData.crew.driver, 0.05);
    },

    fillSelect: function(id, options, defaultValue) {
        const select = document.getElementById(id);
        options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.cut;
            el.innerText = opt.name;
            if (opt.cut === defaultValue) el.selected = true;
            select.appendChild(el);
        });
    },

    renderHackerLegend: function() {
        const list = document.getElementById('hacker-legend-list');
        list.innerHTML = '';

        gameData.crew.hacker.forEach(h => {
            const li = document.createElement('li');
            li.className = "flex justify-between border-b border-gray-800 pb-1 last:border-0 last:pb-0";

            const shortName = h.name.split('(')[0].trim();
            const percentage = h.name.match(/\(([^)]+)\)/)[1];

            li.innerHTML = `
                <span>${shortName} <span class="text-gray-600 text-[10px]">(${percentage})</span></span>
                <span class="text-gray-300 font-mono">${h.time}</span>
            `;
            list.appendChild(li);
        });
    },

    setupListeners: function() {
        document.getElementById('hard-mode').addEventListener('change', (e) => {
            state.isHard = e.target.checked;
            this.update();
        });
        document.getElementById('elite-mode').addEventListener('change', (e) => {
            state.isElite = e.target.checked;
            this.update();
        });

        document.getElementById('event-mode').addEventListener('change', (e) => {
            state.isEvent = e.target.checked;
            this.update();
        });

        ['hacker', 'gunman', 'driver'].forEach(role => {
            document.getElementById(`${role}-select`).addEventListener('change', (e) => {
                state.crew[role] = parseFloat(e.target.value);
                this.update();
            });
        });
    },

    selectTarget: function(id, btnElement) {
        state.targetId = id;
        const allBtns = document.getElementById('target-options').children;
        for (let btn of allBtns) {
            btn.className = 'target-btn p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 text-sm font-bold text-center border-gray-700 bg-gray-800 text-gray-500 hover:bg-gray-700 hover:border-gray-600';
        }
        btnElement.className = 'target-btn p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 text-sm font-bold text-center border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)] scale-[1.02]';
        this.update();
    },

    setBuyer: function(level) {
        state.buyerLevel = level;
        document.querySelectorAll('.buyer-btn').forEach(btn => btn.removeAttribute('data-active'));
        const activeBtn = document.querySelector(`.buyer-btn[data-level="${level}"]`);
        if (activeBtn) activeBtn.setAttribute('data-active', 'true');
        this.update();
    },

    setPlayers: function(num) {
        state.playerCount = num;

        document.querySelectorAll('.p-btn').forEach(btn => {
            if (parseInt(btn.dataset.count) === num) {
                btn.className = "p-btn px-4 py-1 rounded text-sm font-bold bg-gold text-black shadow-lg transform scale-105 transition-all";
            } else {
                btn.className = "p-btn px-4 py-1 rounded text-sm font-bold text-gray-500 hover:text-white transition-colors bg-transparent";
            }
        });

        if (num === 2) { state.players[0].cut = 50; state.players[1].cut = 50; }
        if (num === 3) { state.players[0].cut = 40; state.players[1].cut = 30; state.players[2].cut = 30; }
        if (num === 4) { state.players[0].cut = 25; state.players[1].cut = 25; state.players[2].cut = 25; state.players[3].cut = 25; }

        this.renderPlayersList();
        this.update();
    },

    renderPlayersList: function() {
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
                    oninput="ui.updatePlayerCut(${i}, this.value)">
            `;
            container.appendChild(row);
        }
    },

    updatePlayerCut: function(index, value) {
        state.players[index].cut = parseInt(value);
        document.getElementById(`disp-pct-${index}`).innerText = value + '%';
        this.update();
    },

    update: function() {
        const results = calculator.calculate(state, gameData);

        const eventBadge = document.getElementById('event-badge');
        if (results.isEventActive) {
            eventBadge.classList.remove('hidden');
        } else {
            eventBadge.classList.add('hidden');
        }

        document.getElementById('val-gross').innerText = calculator.formatMoney(results.gross);
        document.getElementById('val-buyer-fee').innerText = "- " + calculator.formatMoney(results.buyerFee);
        document.getElementById('val-deductions').innerText = "- " + calculator.formatMoney(results.deductions);
        document.getElementById('val-elite').innerText = results.elite > 0 ? "+ $ 100,000" : "$ 0";

        const list = document.getElementById('final-payouts-list');
        list.innerHTML = '';

        results.players.forEach(p => {
            const row = document.createElement('div');
            row.className = `flex justify-between items-center ${p.isHost ? 'text-gold font-bold text-lg' : 'text-gray-300 text-base'}`;
            row.innerHTML = `
                <span>${p.name} ${p.isHost ? '<i class="fas fa-crown ml-1 text-xs"></i>' : ''}</span>
                <span>${calculator.formatMoney(p.finalAmount)}</span>
            `;
            list.appendChild(row);
        });

        const totalDisplay = document.getElementById('total-split-display');
        totalDisplay.innerText = results.totalPct + "%";
        if (results.totalPct !== 100) {
            totalDisplay.className = 'text-red-500 font-bold';
        } else {
            totalDisplay.className = 'text-green-500 font-bold';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});