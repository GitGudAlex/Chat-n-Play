const { addPlayer, getPlayersInRoom, getPlayer } = require('../../../models/players');
const { getRoom } = require('../../../models/rooms');

module.exports = (io, socket, data, callback) => {

    // Man kann keinen Raum joinen, wenn man noch in einem Raum drin ist
    if(getPlayer(socket.id) !== undefined) return callback("Du kannst keinen Raum joinen, während du noch in einem bist.");
    
    // Wenn Spielername oder Raum Code nicht angegeben
    if (data.username == '' || data.roomId == '') {
        if(data.username != '') {
            return callback("Du musst einen Raum-Code angeben!");

        } else if(data.roomId != '') {
            return callback("Du musst einen Spielernamen angeben!");

        } else {
            return callback("Du musst einen Spielernamen und Raum Code eingeben!");

        }
    }

    let room = getRoom(data.roomId)

    // Schauen ob der angegebene Raum exestiert
    if (room === undefined) return callback("Der angegebene Raum exestiert nicht!");

    // Raum hat das Spiel schon gestartet
    if (room.hasStarted)  return callback("Der angegbene Raum hat das Spiel bereits gestartet.");

    // Anzahl der maximal Spieler ist erreicht (4)
    if (getPlayersInRoom(data.roomId).length > 3) return callback("Der angegbene Raum hat das Maximum an Spielern bereits erreicht.");

    // Spieler in DB speichern
    const { error, player } = addPlayer(socket.id, data.username, data.roomId );

    // Raum exestiert nicht oder Spiername schon vergeben
    if(error) return callback(error);
    
    // Spieler joined socket.io Raum
    socket.join(player.roomId);
    
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
    socket.emit('room:joined', { gameTypeId, roomId: player.roomId, hostId, players });

    // Im Chat anzeigen, dass man gejoint ist (einem selbst und Mitspieler)
    socket.to(player.roomId).emit('chat:message', { username: '', text: `${player.username} ist dem Spiel beigetreten!` });

    callback();
}