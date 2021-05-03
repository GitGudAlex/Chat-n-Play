const ludoHandler = require('./ludoEventListener/rollLudoListener');
const moveHandler= require('./ludoEventListener/moveLudoListener');
const firstPlayerHandler = require('./ludoEventListener/firstPlayerListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('ludo:firstPlayer', () => firstPlayerHandler(io, socket));

  socket.on("ludo:rollDice", () => ludoHandler(io, socket));

  socket.on('ludo:clickFigure', (id) => moveHandler(io, socket, id));
}