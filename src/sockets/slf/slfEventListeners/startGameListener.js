const { isHost } = require('../../../models/rooms');
const { getPlayersInRoom, getPlayer } = require('../../../models/players');

module.exports = (io, socket, data, callback) => {
    
    // Nur der Host dard das Spiel starten bzw. die Kategorien auswählen
    if(!isHost(socket.id)) return callback('Nur der Host des Raums darf das Spiel starten.');

    // 3-5 Kategorien müssen ausgewählt sein
    if((data.categories).length < 3 || (data.categories).length > 5) return callback('Es dürfen nur 3-5 Kategorien ausgewählt werden!');

    // Host bekommen
    const player = getPlayer(socket.id);

    // Alle Spieler aus dem Raum des 
    const allPlayers = getPlayersInRoom(player.roomId);

    // Spielern weitere Attribute hinzufügen
    allPlayers.forEach(player => {
       player['score'] = 0; 
    });

    const allPlayers2 = getPlayersInRoom(player.roomId);
    console.log(allPlayers2);
}