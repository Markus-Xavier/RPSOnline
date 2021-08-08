const clientEvents = {
    CHOOSE_MOVE: 'player.chooseMove',
    COUNTDOWN: 'countdown',
    ROOM_JOIN: 'room.join',
    ROUND_READY: 'round.ready',
};

const serverEvents = {
    CONNECT: 'connect', 
    DISCONNECT: 'disconnect',
    OPPONENT_CONNECT: 'opponent.connect',
    OPPONENT_LEFT: 'opponent.left',
    ROUND_START: 'round.start',
    ROUND_WINNER: 'round.winner',
    ROOM_JOINED: 'room.joined',
};

export { clientEvents, serverEvents }