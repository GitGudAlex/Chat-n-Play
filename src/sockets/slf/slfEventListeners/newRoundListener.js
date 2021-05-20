const { getPlayer, getPlayersInRoom } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { chooseLetter, getPlayersScores } = require("../../../slf/gameLogic");

module.exports = (io, socket, data, callback) => {

    const player = getPlayer(socket.id);

    if(player !== undefined) {
        const room = getRoom(player.roomId);

        // Spieler noch nicht abgegeben
        if(room.readyPlayers.find(p => p.socketId === player.socketId) === undefined) {
            room.readyPlayers.push(player.socketId);;

            // Spieler zeigen, dass ein Spiler fertig ist
            io.in(player.roomId).emit('slf:players-ready-count', { playersReady: room.readyPlayers });

            const players = getPlayersInRoom(room.roomId);

            if(room.readyPlayers.length === players.length) {

                // Spielern sagen, dass eine neue Runde beginnt
                io.in(player.roomId).emit('slf:new-round');

                // Punkte zum gesamtscore hinzufügen
                for(let p of players) {
                    p.score += p.lastScore;
                    p.lastScore = 0;
                }

                // Scores emitten
                io.in(player.roomId).emit('slf:score-update', { scores: getPlayersScores(players) });

                // Buchstabe schicken
                chooseLetter(room.roomId, (letter) => {
                    io.in(player.roomId).emit('slf:start-round', { letter });
                });
            }
        }
    }
}