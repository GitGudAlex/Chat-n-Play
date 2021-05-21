const joinedEvent = require('./webcamEventListeners/joinedListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('webcam:joined', (data) => joinedEvent(io, socket, data));
}