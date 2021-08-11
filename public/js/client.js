import { clientEvents, serverEvents } from './enum.js';
import Player from './Player.js';
import SocketManager from './SocketManager.js';
import GameManager from './GameManager.js';
import FormManager from './FormManager.js';
import Render from './Render.js';

const loginHandler = (event) => {
  event.preventDefault();
  const userConfig = {
      username: '',
      icon: ''
  };

  for(const pair of new FormData(event.target)) {
      userConfig[pair[0]] = pair[1];
  }
  player.joinServer(userConfig);
  return false;
};

const saveLinkToClipboard = (event) => {
  if(event.target.nodeName === "I") {
    event.preventDefault();
    navigator.clipboard.writeText(event.target.parentNode.innerText);
  } else {
    event.preventDefault();
    navigator.clipboard.writeText(event.target.innerText);
  }
}

const socketManager = new SocketManager();
const render = new Render();
const player = new Player(socketManager, render);
const opponent = new Player(socketManager, render);
const formManager = new FormManager('player-creation', loginHandler);
const battleFormManager = new FormManager('battle-moves', null);
const gameManager = new GameManager(socketManager, render, player, opponent, battleFormManager);
const copyURLButton = document.getElementsByClassName('copy-link-button')[0];
const changeRoomTypeButton = document.getElementsByClassName('change-room-type')[0];
changeRoomTypeButton.addEventListener('click', gameManager.changeGameType.bind(gameManager));
copyURLButton.addEventListener('click', saveLinkToClipboard);
battleFormManager.onChange(player.chooseMove.bind(player));
// buttons.addEventListener('click', player.chooseMove.bind(player));


(() => {
  socketManager.on(serverEvents.ROUND_WINNER, gameManager.roundWinner.bind(gameManager));
  socketManager.on(serverEvents.ROUND_START, (opponentData) => {
    console.log(opponentData);
    gameManager.initializeOpponent(opponentData);
    gameManager.startBattlefield(opponentData);
    gameManager.startTimer();
  });
  // socketManager.on(serverEvents.ROUND_START, .bind(gameManager));
  socketManager.on(serverEvents.ROOM_JOINED, gameManager.waitingForPlayer.bind(gameManager));
  socketManager.on(serverEvents.OPPONENT_LEFT, gameManager.resetGame.bind(gameManager));
  socketManager.on(serverEvents.DISCONNECT, gameManager.resetGame.bind(gameManager))
  render.changeScene(1);
  // socketManager.on(serverEvents.CONNECT);
  // socketManager.on('opponent.connect',);
  // socketManager.on('opponent.pressed.button', opponentPressedButton);
})();