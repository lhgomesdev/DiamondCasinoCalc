const ELITE_BONUS = 100000;
const LESTER_CUT = 0.05;
const BUYER_FEES = { low: 0.10, mid: 0.05, high: 0 };

const calculator = {
    calculate({ targetId, isHard, isEvent, buyerLevel, crew, isElite, players, playerCount }, data) {
        const target = data.targets.find(t => t.id === targetId);

        const baseValue = (isHard ? target.valHard : target.valNormal) * (isEvent ? 2 : 1);
        const buyerFeeAmount = baseValue * (BUYER_FEES[buyerLevel] ?? 0);

        const crewTotalCut = crew.hacker + crew.gunman + crew.driver + LESTER_CUT;
        const deductionAmount = baseValue * crewTotalCut;

        const netTake = baseValue - buyerFeeAmount - deductionAmount;
        const eliteAmount = isElite ? ELITE_BONUS : 0;

        const activePlayers = players.slice(0, playerCount);
        const totalPct = activePlayers.reduce((acc, p) => acc + p.cut, 0);
        
        const payouts = activePlayers.map(p => ({
            ...p,
            finalAmount: Math.max(0, netTake * (p.cut / 100)) + eliteAmount
        }));

        return {
            gross: baseValue,
            buyerFee: buyerFeeAmount,
            deductions: deductionAmount,
            elite: eliteAmount,
            net: netTake,
            players: payouts,
            totalPct,
            isEventActive: isEvent
        };
    },

    formatMoney: (val) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val).replace('$', '$ ')
};