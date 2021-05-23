const { isHost } = require('../../../models/rooms');
const { getPlayer } = require('../../../models/players');

module.exports = (io, socket) => {
    const player = getPlayer(socket.id);

    // Spieler exestiert
    if(player !== undefined) {

        // Ob Spieler Host ist
        if(isHost(player.socketId)) {

            // Allen Spielern mitteilen, dass ein neues Spiel erstellt werden soll
            io.in(player.roomId).emit('room:creating-new-room');
            
        }
    }
}