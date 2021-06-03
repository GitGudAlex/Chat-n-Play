const { getPlayer } = require("../../../models/players");

module.exports = (io, socket, mode) => {

    console.log("testtesttets", mode);

    const player = getPlayer(socket.id);

    io.in(player.roomId).emit('ludo:mode', mode.mode);

}