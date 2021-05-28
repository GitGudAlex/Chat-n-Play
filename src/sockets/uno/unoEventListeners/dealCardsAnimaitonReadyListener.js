const { getPlayer, getPlayersInRoom } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");

module.exports = (io, socket) => {
    
    const player = getPlayer(socket.id);

    // Spieler exestiert nicht
    if(player === undefined) return; 

    // Den ersten Spieler zufällig bestimmen
    const players = getPlayersInRoom(player.roomId);
    let firstPlayer = players[Math.floor(Math.random() * players.length)];

    // Aktiven Spieler speichern
    const room = getRoom(player.roomId);
    room.activePlayer = { socketId: firstPlayer.socketId, position: firstPlayer.position };

    // Allen Spielern die SocketId des nächsten Spielers schicken
    io.in(player.roomId).emit('uno:set-first-player', { socketId: firstPlayer.socketId });
}