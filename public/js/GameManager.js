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
            if(this.totalSecondsRemaining === -1) {
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
        console.log(opponentPiece);
    }

    resetBattlefield() {
        if(!document.querySelector('.battle-platform img').hidden) {
            this.render.toggleHidden(document.querySelector('.battle-platform img'));
        }
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