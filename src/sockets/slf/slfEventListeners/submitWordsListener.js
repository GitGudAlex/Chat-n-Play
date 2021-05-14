const { getPlayer } = require("../../../models/players");
const { submitWords } = require("../../../slf/gameLogic");

module.exports = (io, socket, data, callback) => {

    submitWords(socket.id, data.words, (data) => {
        const player = getPlayer(socket.id);

        io.in(player.roomId).emit('slf:evaluating-results', { words: data });
    });
}