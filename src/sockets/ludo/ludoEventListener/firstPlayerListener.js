const { getPlayer, getCurrentPlayerInRoom } = require('../../../models/players');
const { getRoom } = require('../../../models/rooms');


module.exports = (io, socket) => {
    const player = getPlayer(socket.id);
    const firstPlayer = getCurrentPlayerInRoom(player.roomId);

    const room = getRoom(player.roomId);
    room.gameStatus = 1;

    io.in(player.roomId).emit('ludo:first-player', firstPlayer);
    io.to(firstPlayer.socketId).emit('ludo:unlockDice-firstPlayer');
}