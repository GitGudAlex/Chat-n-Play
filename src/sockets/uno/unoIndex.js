// Event Handling
const submitCardHandler = require('./unoEventListeners/submitCardListener');
const drawCardHandler = require('./unoEventListeners/drawCardListener');
const selectRandomPlayerAnimationReady = require('./unoEventListeners/selectRandomPlayerAnimationReadyListener');
const klopfKlopfHandler = require('./unoEventListeners/klopfKlopfListener');
const endTurnHandler = require('./unoEventListeners/endTurnListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('uno:submit-card', (data) => submitCardHandler(io, socket, data));

  socket.on('uno:draw-card', () => drawCardHandler(io, socket));

  socket.on('uno:select-random-player-animation-ready', () => selectRandomPlayerAnimationReady(io, socket));

  socket.on('uno:klopf-klopf', () => klopfKlopfHandler(io, socket));

  socket.on('uno:end-turn', () => endTurnHandler(io, socket));
}