const fs = require('fs');
const path = require('path');

const { getPlayer } = require('../../../models/players');
const { addRoom } = require('../../../models/rooms');

module.exports = (socket, data, callback) => {
    // Man kann keinen Raum erstellen, wenn man noch in einem Raum drin ist
    if(getPlayer(socket.id) !== undefined) return callback("Du kannst keinen Raum erstellen, während du noch in einem bist.");

    // Falls es eine ungültige GameId übergeben wurde
    if(gameExists(data.gameTypeId)) return callback("Das ausgewählte Spiel gibt es nicht.");
    
    // Event emitten, dass ein Raum erstellt wurde
    const room = addRoom(data.gameTypeId, socket.id);
    socket.emit('room:created', { roomId: room.roomId });

    callback();
}

const gameExists = (gameTypeId) => {
    const json = fs.readFileSync(path.join(__dirname + '../../../../data/gameInfos.json'));
    const obj = JSON.parse(json);

    // Check if the game exists the player wants to play
    const game = obj.find(game => game.id == gameTypeId);
    return (game === undefined) ? true: false;
}