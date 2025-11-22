const calculator = {
    calculate: function(state, data) {

        const targetData = data.targets.find(t => t.id === state.targetId);
        let maxVal = state.isHard ? targetData.valHard : targetData.valNormal;

        if (state.isEvent) {
            maxVal *= 2;
        }

        let buyerFeePct = 0;
        if (state.buyerLevel === 'mid') buyerFeePct = 0.05; // 5%
        if (state.buyerLevel === 'low') buyerFeePct = 0.10; // 10%

        const buyerFeeAmount = maxVal * buyerFeePct;

        const lesterCut = 0.05;
        const crewTotalCut = state.crew.hacker + state.crew.gunman + state.crew.driver;
        const totalDeductionPct = lesterCut + crewTotalCut;

        const deductionAmount = maxVal * totalDeductionPct;

        const netTake = maxVal - buyerFeeAmount - deductionAmount;

        const eliteBonus = state.isElite ? 100000 : 0;

        let playersResult = [];
        let totalPct = 0;

        state.players.slice(0, state.playerCount).forEach(p => {
            totalPct += p.cut;
            const sharePct = p.cut / 100;

            let amount = (netTake * sharePct);
            if (amount < 0) amount = 0;

            amount += eliteBonus;

            playersResult.push({
                ...p,
                finalAmount: amount
            });
        });

        return {
            gross: maxVal,
            buyerFee: buyerFeeAmount,
            deductions: deductionAmount,
            elite: eliteBonus,
            net: netTake,
            players: playersResult,
            totalPct: totalPct,
            isEventActive: state.isEvent
        };
    },

    formatMoney: function(val) {
        return "$ " + val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
};