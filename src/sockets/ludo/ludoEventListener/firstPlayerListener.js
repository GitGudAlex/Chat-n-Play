const { getPlayer, getCurrentPlayerInRoom } = require('../../../models/players');


module.exports = (io, socket) => {
    const player = getPlayer(socket.id);
    const currentPlayer = getCurrentPlayerInRoom(player.roomId);
    io.in(player.roomId).emit('ludo:current-player', currentPlayer.color);
}