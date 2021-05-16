/**
 * { socketId, username, roomId, position, color }
 */
const players = [];

// Farben der Spieler
const colors = ['#0B97F0', '#FCA701', '#00BF02', '#FF3030'];

// add a player
const addPlayer = ( socketId, username, roomId ) => {
    const existingPlayer = players.find((player) => player.roomId === roomId && player.username === username);

    // username or RoomId missing
    if(existingPlayer) return { error: 'Der angegebene Username ist schon in Verwendung.' };

    // get players position. Wenn 2 Spieler bereits im Spiel sind, soll er die position 2 bekommen. (start bei 0)
    let position = getPlayersInRoom(roomId).length;
    
    // adding player
    const player = { socketId, username, roomId, position, color: undefined, active: false };
    players.push(player);

    // returning player object
    return { player };
}
 
// remove a player
const removePlayer = (socketId) => {
    const playerIndex = players.findIndex((player) => player.socketId === socketId);

    if(playerIndex != -1) {
        const player = players[playerIndex];
        players.splice(playerIndex, 1)
        
        return player;
    }

    return false;
}


// get a player with a playerId
const getPlayer = (socketId) => { 
    return players.find((player) => player.socketId === socketId);
}


// get all players from a room with the roomId
const getPlayersInRoom = (roomId) => {
    let playersInRoom = players.filter((player) => player.roomId == roomId);

    return playersInRoom.sort(function(a, b) {
        return a.position - b.position;
    });
}

// return aktuellen Spieler
const getCurrentPlayerInRoom = (roomId) => {
    const allPlayers = getPlayersInRoom(roomId);
    let currentPlayer = null;
    allPlayers.forEach(p => {
        if(p.active == true){
            currentPlayer = p;
        }
    });
    return currentPlayer;
}

//setzt den nächsten Spieler auf active=true
const nextPlayerInRoom = (roomId) => {
    const allPlayers = getPlayersInRoom(roomId);
    const currentPlayer = getCurrentPlayerInRoom(roomId);
    const indexCurrentPlayer = allPlayers.indexOf(currentPlayer);
    const indexNextPlayer = (indexCurrentPlayer + 1) % allPlayers.length;
    allPlayers[indexCurrentPlayer].active = false;
    allPlayers[indexNextPlayer].active = true;
    return allPlayers[indexNextPlayer];
}

// Schaut ob die ausgesucht farbe genommen werden darf 
// und gibt die farben zurück, die noch übrig sind
const setColor = (socketId, color) => {
    let player = getPlayer(socketId);
    let colorArr = getColors(player.roomId);

    let colorObj = colorArr.find((obj) => obj.color == color);

    // Man selber hat die Farbe schon ausgewählt -> Farbe löschen
    if(colorObj.socketId == socketId) {
        let index = players.findIndex((p) => p.socketId === socketId);
        players[index].color = undefined;

        return true;

    // Die Farbe ist noch von niemanden ausgewählt worden -> Farbe setzten
    } else if(colorObj.socketId === undefined) {

        // Farbe für den Spieler setzen
        let index = players.findIndex((p) => p.socketId === socketId);
        players[index].color = color;

        return true;

    // Farbe wurde schon von jemanen ausgewählt -> nichts machen
    } else {
        return false;

    }
}

// Gibt einen Array von JSON-Objekten zurück. In einem JSON Objekt steht jeweils die farbe und wer diese
// Farbe ausgesucht hat (undefinded, wenn noch niemand diese Farbe ausgewählt hat)
const getColors = (roomId) => {
    let result = []
    let playersInRoom = players.filter((p) => p.roomId == roomId);

    // Geht jede Farbe durch und schaut ob diese schon im Raum vergeben ist
    for(color of colors) {
        let index = playersInRoom.findIndex((player) => player.color === color);

        // Farbe im Raum schon vergeben
        if(index != -1) {
            result.push({ color: color, socketId: playersInRoom[index].socketId });

        // Farbe im Raum noch nicht vergeben
        } else {
            result.push({ color: color, socketId: undefined});

        }
    }
    
    return result;
}


const reorderPlayerPositions = (roomId) => {
    let playersInRoom = getPlayersInRoom(roomId);
    
    counter = 0;

    for(player of playersInRoom) {
        let index = playersInRoom.findIndex((p) => p.socketId === player.socketId);
        players[index].position = counter;

        counter++;
    }

    playersInRoom = getPlayersInRoom(roomId);
}


module.exports = { addPlayer, removePlayer, getPlayer, getPlayersInRoom, reorderPlayerPositions, setColor, getColors, getCurrentPlayerInRoom, nextPlayerInRoom };