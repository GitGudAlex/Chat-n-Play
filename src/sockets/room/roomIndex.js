// Event Handling
const createRoomHandler = require('./roomEventListeners/createRoomListener');
const joinRoomHandler = require('./roomEventListeners/joinRoomListener');
const disconnectingHandler = require('./roomEventListeners/disconnectingListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on("room:create", (data, callback) => createRoomHandler(socket, data, callback));
  socket.on("room:join", (data, callback) => joinRoomHandler(io, socket, data, callback));
  socket.on("disconnect", () => disconnectingHandler(io, socket));
}
