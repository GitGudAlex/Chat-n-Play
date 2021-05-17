const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { submitVotes, calculateScore } = require("../../../slf/gameLogic");

module.exports = (io, socket, data, callback) => {

    const player = getPlayer(socket.id);

    if(player !== undefined) {
        let lastSubmit = submitVotes(player, data.results, (data) => {
            io.in(player.roomId).emit('slf:player-submitted', { playersReady:  data.readyPlayers });
            
        });

        // Letzter hat die Bewertung abgegeben => Punkte berechnen
        if(lastSubmit) {

            const room = getRoom(player.roomId);
            calculateScore(room);
        }
    }
}