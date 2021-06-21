const { getPlayer, getColors } = require('../../../models/players');

/**
 * 
 * @param {*} socket 
 */
module.exports = (socket) => {
    const player = getPlayer(socket.id);

    if(player !== undefined) {
        // Farben updaten für Farbauswahl
        socket.emit('room:update-color-selector', { colors: getColors(player.roomId) });
    }
}