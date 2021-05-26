// Event Handling
const submitCardHandler = require('./unoEventListeners/submitCardListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('uno:submit-card', (data) => submitCardHandler(io, socket, data));
}