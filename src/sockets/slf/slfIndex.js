// Event Handling
const startGameHandler = require('./slfEventListeners/startGameListener');
const stopRoundHandler = require('./slfEventListeners/stopRoundListener');
const submitWordsHandler = require('./slfEventListeners/submitWordsListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('slf:start-game', (data, callback) => startGameHandler(io, socket, data, callback));

  socket.on('slf:stop-round', (callback) => stopRoundHandler(io, socket, callback));

  socket.on('slf:submit-words', (data, callback) => submitWordsHandler(io, socket, data, callback));
}