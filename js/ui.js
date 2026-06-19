const STYLE = {
    targetInactive: 'py-3 border-2 border-white/20 bg-black/50 text-gray-400 font-bold hover:bg-white hover:text-black transition-none',
    targetActive: 'py-3 border-2 border-gta-gold bg-gta-gold text-black font-bold transition-none',

    toggleOn: 'w-full py-3 px-4 border-2 border-gta-gold bg-gta-gold text-black font-bold text-left flex justify-between items-center transition-none',
    toggleOff: 'w-full py-3 px-4 border-2 border-white/20 bg-black/50 text-gray-400 font-bold text-left hover:bg-white hover:text-black flex justify-between items-center transition-none',

    buyerActive: 'buyer-btn flex-1 py-2 px-1 border-2 border-gta-gold bg-gta-gold text-black font-bold text-xs text-center transition-none',
    buyerInactive: 'buyer-btn flex-1 py-2 px-1 border-2 border-white/20 bg-black/50 text-gray-400 font-bold hover:bg-white hover:text-black text-xs text-center transition-none',

    playerCountActive: 'p-btn w-10 h-10 border-2 border-gta-gold bg-gta-gold text-black font-gta-heading font-bold text-xl transition-none flex items-center justify-center',
    playerCountInactive: 'p-btn w-10 h-10 border-2 border-white/20 bg-black/50 text-gray-400 font-gta-heading font-bold text-xl hover:bg-white hover:text-black transition-none flex items-center justify-center',

    totalOk: 'text-gta-green',
    totalWarn: 'text-gta-red bg-gta-red/20 px-2 animate-pulse'
};

const DEFAULT_CUTS = {
    2: [50, 50],
    3: [40, 30, 30],
    4: [25, 25, 25, 25]
};

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
        const container = document.getElementById('target-options');
        gameData.targets.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.targetId = t.id;
            btn.setAttribute('aria-pressed', 'false');
            btn.innerHTML = `<i class="fas ${t.icon} text-2xl mb-1"></i><br>${t.name}`;
            container.appendChild(btn);
        });
        if (container.children[1]) this.selectTarget('artwork', container.children[1]);
    },

    selectTarget: function(id, btnElement) {
        state.targetId = id;
        const allBtns = document.getElementById('target-options').children;

        for (const btn of allBtns) {
            const isActive = btn === btnElement;
            btn.className = isActive ? STYLE.targetActive : STYLE.targetInactive;
            btn.setAttribute('aria-pressed', String(isActive));
        }

        this.update();
    },

    populateSelects: function() {
        this.fillSelect('hacker-select', gameData.crew.hacker, state.crew.hacker);
        this.fillSelect('gunman-select', gameData.crew.gunman, state.crew.gunman);
        this.fillSelect('driver-select', gameData.crew.driver, state.crew.driver);
    },

    fillSelect: function(id, options, defaultValue) {
        const select = document.getElementById(id);
        options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.cut;
            el.innerText = `${opt.name} (${Math.round(opt.cut * 100)}%)`;
            el.className = "bg-black text-white";
            if (opt.cut === defaultValue) el.selected = true;
            select.appendChild(el);
        });
    },

    renderHackerLegend: function() {
        const list = document.getElementById('hacker-legend-list');
        list.innerHTML = '';

        gameData.crew.hacker.forEach(({ name, cut, time }) => {
            const li = document.createElement('li');
            li.className = "flex justify-between border-b border-white/10 pb-1 last:border-0 last:pb-0";
            li.innerHTML = `
                    <span>${name} <span class="text-gray-500 opacity-60">(${Math.round(cut * 100)}%)</span></span>
                    <span class="text-white font-gta-heading tracking-widest">${time || '--:--'}</span>
                `;
            list.appendChild(li);
        });
    },

    setupListeners: function() {
        ['hacker', 'gunman', 'driver'].forEach(role => {
            document.getElementById(`${role}-select`).addEventListener('change', (e) => {
                state.crew[role] = parseFloat(e.target.value);
                this.update();
            });
        });

        document.getElementById('target-options').addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            this.selectTarget(btn.dataset.targetId, btn);
        });

        document.getElementById('btn-hard').addEventListener('click', () => this.toggleMode('isHard', 'btn-hard'));
        document.getElementById('btn-elite').addEventListener('click', () => this.toggleMode('isElite', 'btn-elite'));
        document.getElementById('btn-event').addEventListener('click', () => this.toggleMode('isEvent', 'btn-event'));

        document.querySelectorAll('.buyer-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setBuyer(btn.dataset.level));
        });

        document.querySelectorAll('.p-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setPlayers(parseInt(btn.dataset.count, 10)));
        });

        document.getElementById('players-container').addEventListener('input', (e) => {
            if (e.target.matches('input[type="range"]')) {
                const index = parseInt(e.target.dataset.playerIndex, 10);
                this.updatePlayerCut(index, e.target.value);
            }
        });
    },

    toggleMode: function(mode, btnId) {
        state[mode] = !state[mode];
        const btn = document.getElementById(btnId);
        const checkboxIcon = btn.querySelector('.checkbox-icon');

        btn.setAttribute('aria-checked', String(state[mode]));

        if (state[mode]) {
            btn.className = STYLE.toggleOn;
            checkboxIcon.className = 'checkbox-icon fas fa-check-square';
        } else {
            btn.className = STYLE.toggleOff;
            checkboxIcon.className = 'checkbox-icon far fa-square';
        }

        if (mode === 'isHard' && state.isHard) {
            btn.classList.replace('border-gta-gold', 'border-gta-red');
            btn.classList.replace('bg-gta-gold', 'bg-gta-red');
        }

        this.update();
    },

    setBuyer: function(level) {
        state.buyerLevel = level;
        document.querySelectorAll('.buyer-btn').forEach(btn => {
            const isActive = btn.dataset.level === level;
            btn.className = isActive ? STYLE.buyerActive : STYLE.buyerInactive;
            btn.setAttribute('aria-pressed', String(isActive));
        });
        this.update();
    },

    setPlayers: function(num) {
        state.playerCount = num;

        document.querySelectorAll('.p-btn').forEach(btn => {
            const isActive = parseInt(btn.dataset.count, 10) === num;
            btn.className = isActive ? STYLE.playerCountActive : STYLE.playerCountInactive;
            btn.setAttribute('aria-pressed', String(isActive));
        });

        DEFAULT_CUTS[num].forEach((cut, idx) => {
            if (state.players[idx]) state.players[idx].cut = cut;
        });

        this.renderPlayersList();
        this.update();
    },

    renderPlayersList: function() {
        const container = document.getElementById('players-container');
        container.innerHTML = '';

        for (let i = 0; i < state.playerCount; i++) {
            const p = state.players[i];
            const row = document.createElement('div');
            row.className = 'bg-black/40 p-3 border border-white/10';
            row.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-white text-sm tracking-wide ${p.isHost ? 'text-gta-gold' : ''}">${p.name}</span>
                        <span class="font-gta-heading text-gta-gold text-xl" id="disp-pct-${i}">${p.cut}%</span>
                    </div>
                    <input type="range" min="15" max="100" step="5" value="${p.cut}" data-player-index="${i}" aria-label="Porcentagem de ${p.name}">
                `;
            container.appendChild(row);
        }
    },

    updatePlayerCut: function(index, value) {
        state.players[index].cut = parseInt(value, 10);
        document.getElementById(`disp-pct-${index}`).innerText = value + '%';
        this.update();
    },

    update: function() {
        const res = calculator.calculate(state, gameData);

        document.getElementById('event-badge').style.display = res.isEventActive ? 'inline-block' : 'none';
        document.getElementById('val-gross').innerText = calculator.formatMoney(res.gross);
        document.getElementById('val-buyer-fee').innerText = "- " + calculator.formatMoney(res.buyerFee);
        document.getElementById('val-deductions').innerText = "- " + calculator.formatMoney(res.deductions);
        document.getElementById('val-elite').innerText = res.elite > 0 ? "+ " + calculator.formatMoney(res.elite) : "$ 0";

        const list = document.getElementById('final-payouts-list');
        list.innerHTML = '';

        res.players.forEach(p => {
            const row = document.createElement('div');
            row.className = `flex justify-between items-center py-1 ${p.isHost ? 'text-gta-green font-bold' : 'text-white'}`;
            row.innerHTML = `
                    <span class="text-sm font-roboto tracking-widest uppercase">${p.name} ${p.isHost ? '<i class="fas fa-crown text-xs ml-1 text-gta-gold"></i>' : ''}</span>
                    <span>${calculator.formatMoney(p.finalAmount)}</span>
                `;
            list.appendChild(row);
        });

        const totalDisplay = document.getElementById('total-split-display');
        totalDisplay.innerText = res.totalPct + "%";
        totalDisplay.className = res.totalPct === 100 ? STYLE.totalOk : STYLE.totalWarn;
    }
};

document.addEventListener('DOMContentLoaded', () => { ui.init(); });