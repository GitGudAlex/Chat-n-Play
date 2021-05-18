const { getPlayer, getPlayersInRoom } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");

module.exports = (io, socket, data, callback) => {

    const player = getPlayer(socket.id);

    if(player !== undefined) {
        const room = getRoom(player.roomId);

        // Spieler noch nicht abgegeben
        if(room.readyPlayers.find(p => p.socketId === player.socketId) === undefined) {
            room.readyPlayers.push(player.socketId);;

            // Spieler zeigen, dass ein Spiler fertig ist
            io.in(player.roomId).emit('slf:players-ready-count', { playersReady: room.readyPlayers });

            if(room.readyPlayers.length === getPlayersInRoom(room.roomId).length) {
                console.log("Alle abgegeben");
            }
        }
    }
}