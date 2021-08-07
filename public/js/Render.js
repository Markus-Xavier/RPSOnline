export default class Render {
    constructor() {
        this.initialize();
    }

    initialize() {
        document.getElementById('scene-one').hidden = false;
        document.getElementById('scene-two').hidden = true;
        document.getElementById('scene-three').hidden = true;
    }

    toggleHidden(element) {
        element.hidden = !element.hidden;
    }

    renderPlayerBadge(config) {
        document.getElementsByClassName('badge-icon')[0].innerText = config.icon;
        document.getElementsByClassName('badge-username')[0].innerText = config.username;
    }

    renderOpponentBadge(opponentConfig) {
        if(opponentConfig) {
            console.log(opponentConfig);
            document.getElementsByClassName('badge-opponent-icon')[0].innerText = opponentConfig.icon;
            document.getElementsByClassName('badge-opponent-username')[0].innerText = opponentConfig.username;
        }
    }

    renderText(element, text) {
        element.innerText = text;
    }

    changeScene(sceneNumber) {
        switch (sceneNumber) {
            case 1:
                document.getElementById('scene-one').style.display = 'block';
                document.getElementById('scene-two').style.display = 'none';
                document.getElementById('scene-three').style.display = 'none';
                document.getElementsByClassName('player-badge')[0].style.display = 'none';
                document.getElementsByClassName('player-badge')[1].style.display = 'none';
                break;
                
            case 2:
                document.getElementById('scene-one').style.display = 'none';
                document.getElementById('scene-two').style.display = 'block';
                document.getElementById('scene-three').style.display = 'none';
                document.getElementsByClassName('player-badge')[0].style.display = 'flex';
                document.getElementsByClassName('player-badge')[1].style.display = 'flex';

                break;

            case 3:
                document.getElementById('scene-one').style.display = 'none';
                document.getElementById('scene-two').style.display = 'none';
                document.getElementById('scene-three').style.display = 'block';
                document.getElementsByClassName('player-badge')[0].style.display = 'flex';
                document.getElementsByClassName('player-badge')[1].style.display = 'flex';
                break;

            default:
                break;
        }
    }
}