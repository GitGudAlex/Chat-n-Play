// Event Handling
const startGameHandler = require('./unoEventListeners/startGameListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('uno:start-game', () => startGameHandler(io, socket));
}