export default class GameManager {
    constructor(socketManager, render) {
        this.socketManager = socketManager;
        this.render = render;
        this.totalSecondsLeft;
    }

    waitingForPlayer() {
        this.render.changeScene(2);
        document.getElementsByClassName('copy-link-button')[0].innerText = window.location.href;
    }

    startTimer() {
        console.log('starting timer for next round!');
    }

    resetBattlefield() {
        //use render to reset battlefield.
    }

    startBattlefield() {
        this.render.changeScene(3);
    }

    resetGame() {
        history.pushState({}, document.title, '/');
        this.render.changeScene(1);
    }
}