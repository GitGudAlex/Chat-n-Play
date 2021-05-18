const { removeRoom, isHost, setHost, getRoom } = require('../../../models/rooms');
const { removePlayer, getPlayersInRoom, getColors, reorderPlayerPositions } = require('../../../models/players');
const { removePlayerWordsFromCurrentRound, checkAllSubmitted, calculateScore } = require('../../../slf/gameLogic');

module.exports = (io, socket) => {

    // Spieler löschen
    const player = removePlayer(socket.id);

    // Spieler exestiert nicht
    if(player === undefined) {
        return;
    }

    const players = getPlayersInRoom(player.roomId);

    // Socket ist letzter Spieler im Raum -> Raum löschen
    if(players == 0) {
        removeRoom(player.roomId);

    // Spieler ist nicht letzte Spiele rim Raum -> Nachricht
    } else {

        // Die Positionen nur dann neu ordnen, wenn das Spiel noch nicht angfangen hat
        let room = getRoom(player.roomId);

        if(!room.hasStarted) {
            reorderPlayerPositions(room.roomId);
        }
        
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
        let mappedPlayers = getPlayersInRoom(player.roomId).map((player) => {
            let playerObj = { socketId: player.socketId, username: player.username, position: player.position, color: player.color };
            
            return playerObj;
        });

        // Aktuelles Spiel ist Stadt Land Fluss
        if(room.gameTypeId === 2) {

            // Stadt Land Fluss befindet sich gerade in der Bewertungs Phase der Wörter
            // -> Wörter nochmal neu schicken ohne die vom Spieler, der dass Spiel verlassen hat
            if(room.gameStatus === 2) {
                const newWords = removePlayerWordsFromCurrentRound(player);

                // neue Wörter schicken
                io.in(player.roomId).emit('slf:update-words', { words: newWords });

                // schauen ob alle die Wörter abgebgenen haben und nur auf den Spieler gewartet haben, der disconnected ist
                let lastSubmit = checkAllSubmitted(room);

                // Letzter hat die Bewertung abgegeben => Punkte berechnen
                if(lastSubmit) {
                    calculateScore(room);

                }
            }
        }

        io.in(player.roomId).emit('room:update', { players: mappedPlayers });
        io.in(player.roomId).emit('room:update-color-selector', { colors: getColors(player.roomId) });
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