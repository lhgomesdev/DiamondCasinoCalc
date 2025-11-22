let state = {
    targetId: 'artwork',
    isHard: true,
    isElite: false,
    isEvent: false,
    buyerLevel: 'high',
    crew: {
        hacker: 0.10,
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