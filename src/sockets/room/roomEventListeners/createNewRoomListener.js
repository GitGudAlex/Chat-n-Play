const { isHost } = require('../../../models/rooms');
const { getPlayer } = require('../../../models/players');

module.exports = (io, socket) => {
    const player = getPlayer(socket.id);

    // Spieler exestiert
    if(player !== undefined) {

        // Ob Spieler Host ist
        if(isHost(player.socktId)) {

            // Allen Spielern mitteilen, dass ein neues Spiel erstellt wird
            io.in(player.roomId).emit('room:new-room-created');
        }
    }
}