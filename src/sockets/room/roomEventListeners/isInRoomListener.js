const { getPlayer } = require('../../../models/players');

/**
 * 
 * @param {*} socket 
 * @param {*} callback 
 * @returns 
 */
module.exports = (socket, callback) => {
    let player = getPlayer(socket.id);
    
    if(player === undefined) return callback(false);

    return callback(true)
}