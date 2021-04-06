const { addPlayer, getPlayersInRoom, getPlayer } = require('../../../models/players');
const { getRoom } = require('../../../models/rooms');

module.exports = (io, socket, data, callback) => {

    let room = getRoom(data.roomId)

    // Man kann keinen Raum joinen, wenn man noch in einem Raum drin ist
    if(getPlayer(socket.id) !== undefined) return callback("Du kannst keinen Raum joinen, während du noch in einem bist.");

    // Schauen ob der angegebene Raum exestiert
    if (room === undefined) return callback("Der angegebene Raum exestiert nicht!");

    // Spieler in DB speichern
    const { error, player } = addPlayer(socket.id, data.username, data.roomId );

    // Raum exestiert nicht oder Spiername schon vergeben
    if(error) return callback(error);

    // Spieler joined socket.io Raum
    socket.join(player.roomId);

    // Im Chat anzeigen, dass man gejoint ist (einem selbst und Mitspieler)
    socket.to(player.roomId).emit('chat:message', { player: '', text: `${player.username} ist dem Spiel beigetreten!` });
    socket.emit('chat:message', { player: '', text: `Du bist dem Spiel beigetreten!` });
    
    // allen Spielern die neuen Spieler senden
    const players = getPlayersInRoom(player.roomId).map((player) => {
        let playerObj = { socketId: player.socketId, username: player.username };
        
        return playerObj;
    });
    
    // bei allen anderen Spielern die Spieler updaten
    socket.to(player.roomId).emit('room:update', { players, hostId: room.hostId });

    // gameId bekommmen um die mitzusenden
    const gameTypeId = room.gameTypeId;
    const hostId = room.hostId;

    // dem neuen Spieler alle anderen Spieler schicken
    socket.emit('room:joined', { gameTypeId, hostId, players });

    callback();
}