const { getPlayer } = require('../../../models/players');

module.exports = (io, socket, data) => {

    if(data.text.length > 0) {
        const player = getPlayer(socket.id);
        
        socket.to(player.roomId).emit('chat:message', { username: player.username, text: data.text });
        socket.emit('chat:message', { username: 'Du', text: data.text });
    }
}
