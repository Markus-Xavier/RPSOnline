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
        this.gameType = 'classic';
    }

    waitingForPlayer() {
        this.render.changeScene(2);
        const clipboardIcon = document.createElement('i');
        clipboardIcon.classList.add('far', 'fa-copy', 'copy-icon');
        document.getElementsByClassName('copy-link-button')[0].innerText = window.location.href;
        document.getElementsByClassName('copy-link-button')[0].appendChild(clipboardIcon);
    }

    changeGameType(event) {
        event.preventDefault();
        const changeGameTypeButton = document.getElementsByClassName('change-room-type')[0];
        if(changeGameTypeButton.innerText.includes('CLASSIC')) {
            this.render.renderText(changeGameTypeButton, 'UNIQUE');
            this.socketManager.emit('room.changeType', 'unique');
        } else {
            this.render.renderText(changeGameTypeButton, 'CLASSIC');
            this.socketManager.emit('room.changeType', 'classic');
        }
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
                this.render.toggleDisplay(document.querySelector('form[name="battle-moves"]'), 'flex');
            }
        }, 1000)
    }

    checkRoundResult(roundResult) {
        console.log(roundResult);
        if(roundResult === 'draw') {
            return 'It is a draw!';
        }

        if (roundResult === this.player.selectedPiece.type) {
            this.player.wins++;
            return 'Victory!';
        } 
        if (roundResult === this.opponent.selectedPiece) {
            this.opponent.wins++;
            return 'Defeat!';
        }
    }

    updateScoreText() {
        this.render.renderText(document.getElementsByClassName('badge-wins-count')[0], this.player.wins);
        this.render.renderText(document.getElementsByClassName('badge-opponent-wins-count')[0], this.opponent.wins);
    }

    roundWinner(roundResult, opponentPiece) {
        this.opponent.selectedPiece = opponentPiece;
        this.render.renderGamePiece(document.querySelector('.battle-opponent-platform img'), this.render.pieceImages[opponentPiece]);
            setTimeout(() => {
            this.render.toggleHidden(document.getElementsByClassName('timer-text')[0]);
            this.render.toggleHidden(document.getElementsByClassName('countdown-text')[0]);
            this.displayWinningImage(roundResult, opponentPiece, this.checkRoundResult(roundResult));
        } ,3000);
    }

    displayWinningImage(roundResult, opponentPiece, winLoss) {
        let winningImage;
        if(roundResult === 'draw') {
            winningImage = this.render.winningImages['draw' + opponentPiece];
        } else if (roundResult === this.player.selectedPiece.type) {
            winningImage = this.render.winningImages[this.player.selectedPiece.type];
        } else {
            winningImage = this.render.winningImages[opponentPiece];
        }
        this.render.toggleHidden(document.getElementsByClassName('winning-image')[0]);
        this.render.renderGamePiece(document.getElementsByClassName('winning-image')[0], winningImage);
        this.render.toggleHidden(document.querySelector('.battle-opponent-platform img'));
        this.render.toggleHidden(document.querySelector('.battle-platform img'));
        this.render.toggleHidden(document.getElementsByClassName('round-result-text')[0]);
        this.render.renderText(document.getElementsByClassName('round-result-text')[0], winLoss);
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
        this.render.toggleHidden(document.getElementsByClassName('round-result-text')[0]);
        this.render.renderGamePiece(document.querySelector('.battle-opponent-platform img'), this.render.pieceImages.questionMark);
        this.socketManager.emit('round.ready');
        this.player.selectedPiece = '';
        this.battleFormManager.reset();
        this.render.toggleDisplay(document.querySelector('form[name="battle-moves"]'), 'flex');
    }

    startBattlefield(roomInformation) {
        const moreBattleMoves = document.getElementsByClassName('additional-battle-moves');
        if (roomInformation && roomInformation.roomType === 'unique') {
            this.gameType = 'unique';
            for (let i = 0; i < moreBattleMoves.length; i++){
                this.render.toggleHidden(moreBattleMoves[i]);
            }
        }
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