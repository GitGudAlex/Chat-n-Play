const fs = require('fs');
const path = require('path');

const { getPlayer, getPlayersInRoom } = require('../../../models/players');
const { addRoom, removeRoom, isHost } = require('../../../models/rooms');

module.exports = (io, socket, data, callback) => {

    // Man kann ertsmal keinen Raum erstellen, wenn man noch in einem Raum drin ist
    const oldPlayer = getPlayer(socket.id);

    // Wenn ein neues Spiel erstellt wurde, nachdem man zuende gespielt hat
    let newGame = false;

    // Spieler befindet sich schon im Speicher
    if(oldPlayer !== undefined) {

        // Ob Spieler Host ist
        if(isHost(oldPlayer.socketId)) {

            // alten Raum löschen
            removeRoom(oldPlayer.roomId);

            newGame = true;

        } else {
            return callback("Du kannst kein neues Spiel starten, da du nicht der Host bist.");
        }
    }

    // Falls es eine ungültige GameId übergeben wurde
    if(gameExists(data.gameTypeId)) return callback("Das ausgewählte Spiel gibt es nicht.");
    
    // Event emitten, dass ein Raum erstellt wurde
    const room = addRoom(data.gameTypeId, socket.id);

    // Ein Spiel erstellen, nachdem man eins zuende gespielt hat
    if(newGame) {
        io.in(oldPlayer.roomId).emit('room:created-new', { roomId: room.roomId, gameId: data.gameTypeId });

    // Normales Spiel erstellen
    } else {
        socket.emit('room:created', { roomId: room.roomId, gameId: data.gameTypeId });

    }

    callback();

    // Schauen ob der Host auch direkt dem Spiel beitritt. Sonst kann der Raum gelöscht werden (Memory Leaks verhinden)
    setTimeout(function() {
        let players = getPlayersInRoom(room.roomId).length;

        if (players == 0) {
            removeRoom(room.roomId)
        }
    }, 1500);
}

const gameExists = (gameTypeId) => {
    const json = fs.readFileSync(path.join(__dirname + '../../../../data/games.json'));
    const obj = JSON.parse(json);

    // Check if the game exists the player wants to play
    const game = obj.find(game => game.id == gameTypeId);
    return (game === undefined) ? true: false;
}