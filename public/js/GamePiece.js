export default class GamePiece {
    constructor(type) {
        this.type = type;
        this.winCondition = this.determineWinCondition();
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