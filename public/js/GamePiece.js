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
            return ['scissors', 'lizard'];
        } else if (this.type === 'paper') {
            return ['rock', 'alien'];
        } else if (this.type === 'scissors') {
            return ['paper', 'lizard'];
        } else if (this.type === 'lizard') {
            return ['alien', 'paper']; 
        } else if (this.type === 'alien') {
            return ['scissors', 'rock'];
        }
    }
}