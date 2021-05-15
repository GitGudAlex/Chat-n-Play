const { getPlayer } = require('../../../models/players');

module.exports = (io, socket, callback) => {
    const player = getPlayer(socket.id);

    if(player !== undefined) {
        io.in(player.roomId).emit('slf:round-stopped');
    }
}