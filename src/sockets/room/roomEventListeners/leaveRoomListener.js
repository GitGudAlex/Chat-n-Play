const { removeRoom, isHost, getHost, setHost } = require('../../../models/rooms');
const { removePlayer, getPlayersInRoom } = require('../../../models/players');

module.exports = (io, socket) => {

    // Spieler löschen
    const player = removePlayer(socket.id);
    const players = getPlayersInRoom(player.roomId);

    // Socket ist letzter Spieler im Raum -> Raum löschen
    if(players == 0) {
        removeRoom(player.roomId);

    // Spieler ist nicht letzte Spiele rim Raum -> Nachricht
    } else {
        socket.to(player.roomId).emit('chat:message', { username: '', text: `${player.username} hat das Spiel verlassen!` });

        // Wenn der Spieler der aktuelle Host des Raums ist => Host neu bestimmen
        if(isHost(player.socketId)) {
            // neuen host setzten
            const newHost = getRandomItem(players);
            setHost(newHost.roomId, newHost.socketId);

            // Sends a message to all clients, that the host has changed
            const newHostSocket = io.of("/").sockets.get(newHost.socketId);

            newHostSocket.to(newHost.roomId).emit('chat:message', { username: '', text: `${newHost.username} ist der neue Host des Spiels!` });
            newHostSocket.emit('chat:message', { username: '', text: 'Du bist der neue Host des Spiels!' });

            // extra Event
            io.in(newHost.roomId).emit("room:hostChanged", { hostId: newHost.socketId});

        }

        // allen Spielern die neuen Spieler senden
        let playersReturn = getPlayersInRoom(player.roomId).map((player) => {
            let playerObj = { socketId: player.socketId, username: player.username };
            
            return playerObj;
        });

        io.in(player.roomId).emit('room:update', { players: playersReturn, hostId: getHost(player.roomId) });
    }

    // Spieler aus dem Socket.io Raum rauswerfen
    socket.leave(player.roomId);
}

// selects a random host
const getRandomItem = (arr) => {

    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];

    return item;
}