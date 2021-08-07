const express = require('express');
const app = express();
app.use(express.static('public'));
const port = process.env.PORT || 5000;
const http = require('http').createServer(app);
const io = require('socket.io')(http, {pingTimeout: 60000});

http.listen(port);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let players = {};
let rooms = {};

const logButtonPressed = (data) => {
  console.log(data);
};

const declareWinner = (firstGamePiece, secondGamePiece, socket) => {
  const first = firstGamePiece.type;
  const second = secondGamePiece.type;

  if (first === second) {
    socket.emit('round.winner', 'draw');
    findOpponent(socket).socket.emit('round.winner', 'draw');
    return;
  }

  if (firstGamePiece.winCondition === second) {
    socket.emit('round.winner', first);
    findOpponent(socket).socket.emit('round.winner', first);
  } else {
    socket.emit('round.winner', second);
    findOpponent(socket).socket.emit('round.winner', second);
  }
};

const clearPlayerMoves = (player, opponent) => {
  player.move = '';
  opponent.move = '';
};

function initConnection(socket) {
  socket.emit('connect');
  socket.on('room.join', (roomID, username, icon) => {
    joinGame(socket, roomID, username, icon);
  });

  socket.on('disconnect', () => {
    const player = players[socket.id];
    if (player) {
      if (findOpponent(socket)) {
        findOpponent(socket).room = '';
        findOpponent(socket).socket.emit('opponent.left');
      }
      delete rooms[player.room];
    }
  });

  socket.on('player.chooseMove', (data) => {
    const opponent = findOpponent(socket);
    players[socket.id].move = data;
    if (opponent && opponent.move) {
      declareWinner(players[socket.id].move, opponent.move, socket);
      clearPlayerMoves(players[socket.id], opponent);
      socket.emit('round.start');
      opponent.socket.emit('round.start');
    }
  });
};

io.sockets.on('connection', initConnection.bind(players));

function joinGame(socket, roomID, username, icon) {
  const targetRoom = rooms[roomID];
  players[socket.id] = {
    socket: socket,
    move: '',
    room: '',
    username: username,
    icon: icon,
    isPlayerOne: false,
  };
  const targetPlayer = players[socket.id];
  if (targetRoom) {
    if (targetRoom.playerOne && targetRoom.playerTwo) {
      socket.emit('room.full');
    } else {
      targetRoom.playerTwo = socket.id;
      targetPlayer.room = roomID;
      socket.emit('round.start', {name: findOpponent(socket).username, icon: findOpponent(socket).icon});
      findOpponent(socket).socket.emit('round.start', {name: targetPlayer.name, icon: targetPlayer.icon});
    }
  } else {
    rooms[roomID] = {
      playerOne: socket.id,
      playerTwo: '',
    };
    targetPlayer.isPlayerOne = true;
    targetPlayer.room = roomID;
    socket.emit('room.joined');
  }
}

function findOpponent(socket) {
  const player = players[socket.id];
  if (player) {
    const roomID = player.room;
    const targetRoom = rooms[roomID];
    if (targetRoom) {
      return player.isPlayerOne ? players[targetRoom.playerTwo] : players[targetRoom.playerOne];
    }
  }
}