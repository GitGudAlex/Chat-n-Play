const fs = require('fs');
const path = require('path');

const { isHost } = require('../../../models/rooms');
const { getPlayer } = require('../../../models/players');

module.exports = (io, socket) => {
    const player = getPlayer(socket.id);

    // Spieler exestiert
    if(player !== undefined) {

        // Ob Spieler Host ist
        if(isHost(player.socketId)) {

            // Falls eine ungültige GameId übergeben wurde
            if(gameExists(data.gameTypeId)) return callback("Das ausgewählte Spiel gibt es nicht.");

            // Event emitten, dass ein Raum erstellt wurde
            const room = addRoom(data.gameTypeId, socket.id);

            // Allen Spielern mitteilen, dass ein neues Spiel erstellt wird
            io.in(player.roomId).emit('room:new-room-created', { roomId: room.roomId, gameId: data.gameTypeId });

            // Schauen ob der Host auch direkt dem Spiel beitritt. Sonst kann der Raum gelöscht werden (Memory Leaks verhinden)
            setTimeout(function() {
                let players = getPlayersInRoom(room.roomId).length;

                if (players == 0) {
                    removeRoom(room.roomId)
                }
            }, 1500);
        }
    }
}

const gameExists = (gameTypeId) => {
    const json = fs.readFileSync(path.join(__dirname + '../../../../data/games.json'));
    const obj = JSON.parse(json);

    // Check if the game exists the player wants to play
    const game = obj.find(game => game.id == gameTypeId);
    return (game === undefined) ? true: false;
}