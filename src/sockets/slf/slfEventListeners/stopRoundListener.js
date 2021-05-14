const { getPlayer } = require('../../../models/players');

module.exports = (io, socket, callback) => {
    const player = getPlayer(socket.id);

    io.in(player.roomId).emit('slf:round-stopped');
}