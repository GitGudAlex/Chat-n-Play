const { getPlayer, getCurrentPlayerInRoom } = require('../../../models/players');


module.exports = (io, socket) => {
    const player = getPlayer(socket.id);
    const firstPlayer = getCurrentPlayerInRoom(player.roomId);
    io.in(player.roomId).emit('ludo:first-player', firstPlayer);
    io.to(firstPlayer.socketId).emit('ludo:unlockDice-firstPlayer');
}