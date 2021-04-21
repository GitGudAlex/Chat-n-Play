const { getPlayer } = require('../../../models/players');

module.exports = (socket, callback) => {
    let player = getPlayer(socket.id);
    console.log("Checking...");
    if(player === undefined) return callback(false);

    return callback(true)
}