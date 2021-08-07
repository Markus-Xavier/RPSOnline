import GamePiece from "./GamePiece.js";
import { clientEvents } from "./enum.js";

export default class Player {
    constructor(socketManager, render) {
        this.username = '';
        this.icon = '';
        this.selectedPiece = null;
        this.socketManager = socketManager;
        this.render = render;
        this.wins = 0;
        this.opponentsWins = 0;
    }

    initialize(playerConfig) {
        this.username = playerConfig.username;
        this.icon = playerConfig.icon;
    }

    chooseMove(event) {
        if(!event.target) {
            const playerOptions = ['rock', 'paper', 'scissors'];
            const randomGamePiece = playerOptions[Math.floor(Math.random() * (3 - 0) + 0)];
            console.log(randomGamePiece);
            this.selectedPiece = new GamePiece(randomGamePiece, this.render);
            this.selectedPiece.showInBattlefield();
            return;
        }
        event.preventDefault();
        console.log(event.target.parentNode);
        if(event.target.nodeName === 'DIV') {
            return;
        }

        if(event.target.nodeName === 'BUTTON') {
            this.selectedPiece = new GamePiece(event.target.value, this.render);
        } else if (event.target.nodeName === 'IMG') {
            this.selectedPiece = new GamePiece(event.target.parentNode.value, this.render);
        }
        this.selectedPiece.showInBattlefield();
    }

    roundWinner(data, opponentPiece) {
        console.log (opponentPiece);
        if (data === 'draw') {
            console.log('we draw!');
        } else if (data === this.selectedPiece.type) {
            console.log('I win!');
            this.wins++;
            this.render.renderText(document.getElementsByClassName('badge-wins-count')[0], this.wins);
            console.log()
        } else {
            console.log('I lose!');
            this.opponentsWins++;
            this.render.renderText(document.getElementsByClassName('badge-opponent-wins-count')[0], this.opponentsWins);
        }
    }

    joinServer(config) {
        this.initialize(config);
        this.render.renderPlayerBadge(config);
        const urlParams = new URLSearchParams(window.location.search);
        let roomID = urlParams.get('room');
        if (!roomID) {
            urlParams.set('room', Math.random());
            history.replaceState(null, null, "?" + urlParams.toString());
            roomID = urlParams.get('room');
            console.log(roomID);
        }
        this.socketManager.emit(clientEvents.ROOM_JOIN, {roomID, username: config.username, icon: config.icon});
    }
}