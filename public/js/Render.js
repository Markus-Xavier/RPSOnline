export default class Render {
    constructor() {
        this.initialize();
        this.pieceImages = {
            rock: '/assets/Rock_Sticker.png',
            paper: '/assets/Paper_Sticker.png',
            scissors: '/assets/Scissor_Sticker.png',
            lizard: '/assets/Lizard_Sticker.png',
            alien: '/assets/Alien_Sticker.png',
            questionMark: '/assets/Question_Mark.svg',
        }
        this.winningImages = {
            rock: '/assets/Rock_Wins_Sticker.png',
            paper: '/assets/Paper_Wins_Sticker.png',
            scissors: '/assets/Scissor_Wins_Sticker.png',
            drawrock: '/assets/Rock_Tie_Sticker.png',
            drawpaper: '/assets/Paper_Tie_Sticker.png',
            drawscissors: '/assets/Scissor_Tie_Sticker.png',
        }
    }

    initialize() {
        document.getElementById('scene-one').hidden = false;
        document.getElementById('scene-two').hidden = true;
        document.getElementById('scene-three').hidden = true;
    }

    toggleHidden(element) {
        element.hidden = !element.hidden;
    }

    toggleDisplay(element, originalDisplay) {
        if(!element.style.display) {
            element.style.display = originalDisplay;
        }
        if (element.style.display === originalDisplay) {
            element.style.display = 'none';
        } else {
            element.style.display = originalDisplay;
        }
    } 

    renderOpponentBadge(opponentConfig) {
        if(opponentConfig) {
            console.log(opponentConfig);
            document.getElementsByClassName('badge-opponent-icon')[0].innerText = opponentConfig.icon;
            document.getElementsByClassName('badge-opponent-username')[0].innerText = opponentConfig.username;
        }
    }

    renderGamePiece(location, gamePiece) {
        location.src = gamePiece;
    }

    renderText(element, text) {
        element.innerText = text;
    }

    timerTextColor(timerNumber) {
        if(timerNumber < 3) {
            document.getElementsByClassName('timer-text')[0].classList.add('timer-text-danger');
        } else if (timerNumber < 5) {
            document.getElementsByClassName('timer-text')[0].classList.add('timer-text-warning');
        } else {
            document.getElementsByClassName('timer-text')[0].classList.remove('timer-text-danger');
            document.getElementsByClassName('timer-text')[0].classList.remove('timer-text-warning');
        }
    }

    changeScene(sceneNumber) {
        switch (sceneNumber) {
            case 1:
                document.querySelector('main').classList.remove('flex-battle');
                document.getElementById('scene-one').style.display = 'block';
                document.getElementById('scene-two').style.display = 'none';
                document.getElementById('scene-three').style.display = 'none';
                document.getElementsByClassName('player-badge')[0].style.display = 'none';
                document.getElementsByClassName('player-badge')[1].style.display = 'none';
                break;
                
            case 2:
                document.querySelector('main').classList.remove('flex-battle');
                document.getElementById('scene-one').style.display = 'none';
                document.getElementById('scene-two').style.display = 'block';
                document.getElementById('scene-three').style.display = 'none';
                document.getElementsByClassName('player-badge')[0].style.display = 'flex';
                document.getElementsByClassName('player-badge')[1].style.display = 'flex';
                break;

            case 3:
                document.querySelector('main').classList.add('flex-battle');
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