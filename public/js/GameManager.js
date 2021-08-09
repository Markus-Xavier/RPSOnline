import { clientEvents } from "./enum.js";

export default class GameManager {
    constructor(socketManager, render, player) {
        this.socketManager = socketManager;
        this.render = render;
        this.totalSecondsRemaining = 10;
        this.intervalID;
        this.player = player;
    }

    waitingForPlayer() {
        this.render.changeScene(2);
        document.getElementsByClassName('copy-link-button')[0].innerText = window.location.href;
    }

    startTimer() {
        console.log('starting timer for next round!');
        this.intervalID = setInterval(() => {
            this.render.renderText(document.getElementsByClassName('timer-text')[0], this.totalSecondsRemaining);
            this.totalSecondsRemaining--;
            this.render.timerTextColor(this.totalSecondsRemaining);
            if(this.totalSecondsRemaining < 0) {
                if (!this.player.selectedPiece) {
                    this.player.chooseMove('no piece selected');
                }
                this.socketManager.emit('player.chooseMove', this.player.selectedPiece);
                this.clearInterval();
                this.totalSecondsRemaining = 10;
            }
        }, 1000)
    }

    roundWinner(roundResult, opponentPiece) {
        this.player.updateScore(roundResult);
        this.render.renderGamePiece(document.querySelector('.battle-opponent-platform img'), this.render.pieceImages[opponentPiece]);
            setTimeout(() => {
            this.render.toggleHidden(document.getElementsByClassName('timer-text')[0]);
            this.render.toggleHidden(document.getElementsByClassName('countdown-text')[0]);
            this.displayWinningImage(roundResult, opponentPiece);
        } ,3000);
    }

    displayWinningImage(roundResult, opponentPiece) {
        let winningImage;
        if(roundResult === 'draw') {
            winningImage = this.render.winningImages['draw' + opponentPiece];
        } else if (roundResult === this.player.selectedPiece.type) {
            winningImage = this.render.winningImages[this.player.selectedPiece.type];
        } else {
            winningImage = this.render.winningImages[opponentPiece];
        }
        console.log(roundResult, opponentPiece, winningImage);
        this.render.toggleHidden(document.getElementsByClassName('winning-image')[0]);
        this.render.renderGamePiece(document.getElementsByClassName('winning-image')[0], winningImage);
        this.render.toggleHidden(document.querySelector('.battle-opponent-platform img'));
        this.render.toggleHidden(document.querySelector('.battle-platform img'));
        setTimeout(this.resetBattlefield.bind(this), 3000);
    }

    resetBattlefield() {
        this.render.timerTextColor(this.totalSecondsRemaining);
        this.render.renderText(document.getElementsByClassName('timer-text')[0], this.totalSecondsRemaining);
        this.render.toggleHidden(document.getElementsByClassName('winning-image')[0]);
        this.render.toggleHidden(document.getElementsByClassName('timer-text')[0]);
        this.render.toggleHidden(document.getElementsByClassName('countdown-text')[0]);
        this.render.toggleHidden(document.querySelector('.battle-opponent-platform img'));
        this.render.renderGamePiece(document.querySelector('.battle-opponent-platform img'), this.render.pieceImages.questionMark);
        this.socketManager.emit('round.ready');
        this.player.selectedPiece = '';
    }

    startBattlefield() {
        this.render.changeScene(3);
    }

    resetGame() {
        history.pushState({}, document.title, '/');
        this.render.changeScene(1);
    }

    clearInterval() {
        clearInterval(this.intervalID);
    }
}