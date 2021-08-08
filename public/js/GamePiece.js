export default class GamePiece {
    constructor(type, render) {
        this.type = type;
        this.winCondition = this.determineWinCondition();
        this.render = render;
    }

    showInBattlefield() {
        if (document.querySelector('.battle-platform img').hidden) {
            this.render.toggleHidden(document.querySelector('.battle-platform img'));
        }
        this.render.renderGamePiece(document.querySelector('.battle-platform img'), this.render.pieceImages[this.type]);
    }

    determineWinCondition() {
        if (this.type === 'rock') {
            return 'scissors';
        } else if (this.type === 'paper') {
            return 'rock';
        } else if (this.type === 'scissors') {
            return 'paper';
        }
    }
}