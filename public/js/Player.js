import GamePiece from "./GamePiece.js";
import { clientEvents } from "./enum.js";
import LinkGenerator from "./LinkGenerator.js";

export default class Player {
    constructor(socketManager, render) {
        this.username = '';
        this.icon = '';
        this.selectedPiece = null;
        this.socketManager = socketManager;
        this.render = render;
        this.wins = 0;
        this.opponentsWins = 0;
        this.linkGenerator = new LinkGenerator();
    }

    initialize(playerConfig) {
        this.username = playerConfig.username;
        this.icon = playerConfig.icon;
    }

    chooseMove(event) {
        if(!event.target) {
            const playerOptions = ['rock', 'paper', 'scissors'];
            const randomGamePiece = playerOptions[Math.floor(Math.random() * (3 - 0) + 0)];
            this.selectedPiece = new GamePiece(randomGamePiece, this.render);
            this.selectedPiece.showInBattlefield();
        } else {
            this.selectedPiece = new GamePiece(event.target.value, this.render);
            this.selectedPiece.showInBattlefield();
        }
    }

    updateScore(roundResult) {
        if(roundResult === 'draw') {
            console.log('draw');
            return;
        }

        if (roundResult === this.selectedPiece.type) {
            console.log('I win!');
            this.wins++;
            this.render.renderText(document.getElementsByClassName('badge-wins-count')[0], this.wins);
        } 
        if (roundResult !== this.selectedPiece.type) {
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
            urlParams.set('room', this.linkGenerator.generateLink());
            history.replaceState(null, null, "?" + urlParams.toString());
            roomID = urlParams.get('room');
            console.log(roomID);
        }
        this.socketManager.emit(clientEvents.ROOM_JOIN, {roomID, username: config.username, icon: config.icon});
    }
}