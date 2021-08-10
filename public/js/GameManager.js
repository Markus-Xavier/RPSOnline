import { clientEvents } from "./enum.js";

export default class GameManager {
    constructor(socketManager, render, player, opponent, battleFormManager) {
        this.socketManager = socketManager;
        this.render = render;
        this.totalSecondsRemaining = 10;
        this.intervalID;
        this.player = player;
        this.opponent = opponent;
        this.battleFormManager = battleFormManager;
    }

    waitingForPlayer() {
        this.render.changeScene(2);
        document.getElementsByClassName('copy-link-button')[0].innerText = window.location.href;
    }

    initializeOpponent(opponentConfig) {
        if(opponentConfig) {
            this.opponent.initialize(opponentConfig);
            this.opponent.renderPlayerBadge(opponentConfig, {icon: document.getElementsByClassName('badge-opponent-icon')[0], username: document.getElementsByClassName('badge-opponent-username')[0]});
        }
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
                console.log('hi');
                this.render.toggleDisplay(document.querySelector('form[name="battle-moves"]'), 'flex');
            }
        }, 1000)
    }


    checkRoundResult(roundResult) {
        console.log(roundResult);
        if(roundResult === 'draw') {
            console.log('draw');
            return;
        }

        if (roundResult === this.player.selectedPiece.type) {
            console.log('I win!');
            this.player.wins++;
        } 
        if (roundResult === this.opponent.selectedPiece) {
            console.log('I lose!');
            this.opponent.wins++;
        }
    }

    updateScoreText() {
        this.render.renderText(document.getElementsByClassName('badge-wins-count')[0], this.player.wins);
        this.render.renderText(document.getElementsByClassName('badge-opponent-wins-count')[0], this.opponent.wins);
    }

    roundWinner(roundResult, opponentPiece) {
        this.opponent.selectedPiece = opponentPiece;
        this.checkRoundResult(roundResult);
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
        this.updateScoreText();
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
        this.battleFormManager.reset();
        this.render.toggleDisplay(document.querySelector('form[name="battle-moves"]'), 'flex');
    }

    startBattlefield() {
        this.render.changeScene(3);
    }

    resetGame() {
        history.pushState({}, document.title, '/');
        this.render.changeScene(1);
        this.player.wins = 0;
        this.opponent.wins = 0;
    }

    clearInterval() {
        clearInterval(this.intervalID);
    }
}