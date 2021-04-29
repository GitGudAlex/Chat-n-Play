const { getRoom, isHost } = require('../../../models/rooms');
const { getPlayersInRoom, getPlayer, setColor, getColors } = require('../../../models/players');

module.exports = (io, socket, callback) => {
    
    // Farben setzten, bei denen, die noch keine Farbe ausgesucht haben
    const player = getPlayer(socket.id);
    const allPlayers = getPlayersInRoom(player.roomId);

    if(allPlayers.length < 2) return callback('Es müssen mindestens 2 Spieler anwesend sein!');

    if(!isHost(socket.id)) return callback('Nur der Host kann ein Spiel starten.');

    const colors = getColors(player.roomId);
    const availableColors = colors.filter((color) => color.socketId === undefined);

    for(p of allPlayers) {

        // Farbe wurde noch nicht ausgesucht
        if(p.color === undefined) {

            // Zufällige Farbe auswählen
            var rndIndex = Math.floor(Math.random() * availableColors.length);

            // Farbe setzten
            setColor(p.socketId, availableColors[rndIndex].color);

            // Ausgwählte Farbe von den verfügbaren streichen
            availableColors.splice(rndIndex, 1);
        }
    }

    const players = getPlayersInRoom(player.roomId);

    io.in(player.roomId).emit('room:update', { players });
    io.in(player.roomId).emit('room:update-color-selector', { colors: getColors(player.roomId) });


    // Spiel starten
    const room = getRoom(player.roomId);
    const gameTypeId = room.gameTypeId;

    // Mensch Ärger dich nicht
    if(gameTypeId == 0) {
        console.log("Starte Mensch Ärger dich nicht");

    } else {
        return callback("Spiel exestiert noch nicht!");

    }

    callback();

}