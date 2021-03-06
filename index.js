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
    socket.emit('round.winner', 'draw', second);
    findOpponent(socket).socket.emit('round.winner', 'draw', first);
    return;
  }

  if (firstGamePiece.winCondition.includes(second)) {
    socket.emit('round.winner', first, second);
    findOpponent(socket).socket.emit('round.winner', first, first);
  } else {
    socket.emit('round.winner', second, second);
    findOpponent(socket).socket.emit('round.winner', second, first);
  }
};

const clearPlayerMoves = (player, opponent) => {
  player.move = '';
  opponent.move = '';
};

function initConnection(socket) {
  socket.emit('connect');
  socket.on('room.join', (playerData) => {
    joinGame(socket, playerData.roomID, playerData.username, playerData.icon);
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

  socket.on('room.changeType', (roomType) => {
    targetRoom = players[socket.id].room;
    rooms[targetRoom].roomType = roomType;
  });

  socket.on('player.chooseMove', (data) => {
    const opponent = findOpponent(socket);
    players[socket.id].move = data;
    if (opponent && opponent.move) {
      declareWinner(players[socket.id].move, opponent.move, socket);
      clearPlayerMoves(players[socket.id], opponent);
    }
  });

  socket.on('round.ready', () => {
    const opponent = findOpponent(socket);
    if(!players[socket.id]) {
      return
    } else {
      players[socket.id].roundReady = true;
      if (opponent && opponent.roundReady) {
        socket.emit('round.start');
        opponent.socket.emit('round.start');
        players[socket.id].roundReady = false;
        opponent.roundReady = false;
      }
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
    roundReady: false
  };
  const targetPlayer = players[socket.id];
  if (targetRoom) {
    if (targetRoom.playerOne && targetRoom.playerTwo) {
      socket.emit('room.full');
    } else {
      targetRoom.playerTwo = socket.id;
      targetPlayer.room = roomID;
      socket.emit('round.start', {username: findOpponent(socket).username, icon: findOpponent(socket).icon, roomType: targetRoom.roomType});
      findOpponent(socket).socket.emit('round.start', {username: targetPlayer.username, icon: targetPlayer.icon, roomType: targetRoom.roomType});
    }
  } else {
    rooms[roomID] = {
      playerOne: socket.id,
      playerTwo: '',
      roomType: 'classic',
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