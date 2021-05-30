// Event Handling
const submitCardHandler = require('./unoEventListeners/submitCardListener');
const selectRandomPlayerAnimationReady = require('./unoEventListeners/selectRandomPlayerAnimationReadyListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('uno:submit-card', (data) => submitCardHandler(io, socket, data));

  socket.on('uno:select-random-player-animation-ready', () => selectRandomPlayerAnimationReady(io, socket));
}