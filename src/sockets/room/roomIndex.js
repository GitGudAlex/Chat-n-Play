// Event Handling
const createRoomHandler = require('./roomEventListeners/createRoomListener');
const joinRoomHandler = require('./roomEventListeners/joinRoomListener');
const isInRoomHandler = require('./roomEventListeners/isInRoomListener');
const disconnectingHandler = require('./roomEventListeners/disconnectingListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on("room:create", (data, callback) => createRoomHandler(socket, data, callback));
  socket.on("room:join", (data, callback) => joinRoomHandler(io, socket, data, callback));
  socket.on("room:is-in-room", (callback) => isInRoomHandler(socket, callback));
  socket.on("disconnect", () => disconnectingHandler(io, socket));
}
