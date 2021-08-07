import GamePiece from "./GamePiece.js";
import { clientEvents } from "./enum.js";

export default class Player {
    constructor(socketManager) {
        this.username = '';
        this.icon = '';
        this.selectedPiece;
        this.socketManager = socketManager;
    }

    initialize(playerConfig) {
        this.username = playerConfig.username;
        this.icon = playerConfig.icon;
    }

    chooseMove(event) {
        event.preventDefault();
        this.selectedPiece = new GamePiece(event.target.value);
        this.socketManager.emit('player.chooseMove', this.selectedPiece);
    }

    roundWinner(data) {
        if (data === 'draw') {
            console.log('we draw!');
        } else if (data === this.selectedPiece.type) {
            console.log('I win!');
        } else {
            console.log('I lose!');
        }
    }

    joinServer(config) {
        this.initialize(config);
        const urlParams = new URLSearchParams(window.location.search);
        let roomID = urlParams.get('room');
        if (!roomID) {
            urlParams.set('room', Math.random());
            history.replaceState(null, null, "?" + urlParams.toString());
            roomID = urlParams.get('room');
            console.log(roomID);
        }
        this.socketManager.emit(clientEvents.ROOM_JOIN, roomID, this.username, this.icon);
    }
}