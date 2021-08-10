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

    joinServer(config) {
        this.initialize(config);
        this.renderPlayerBadge(config, {icon: document.getElementsByClassName('badge-icon')[0], username: document.getElementsByClassName('badge-username')[0]});
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

    renderPlayerBadge(config, locations) {
        if(config) {
            this.render.renderText(locations.icon, config.icon);
            this.render.renderText(locations.username, config.username);
        }
    }
}