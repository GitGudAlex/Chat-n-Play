/**
 * { socketId, username, roomId }
 */
const players = [];

// add a player
const addPlayer = ( socketId, username, roomId ) => {
    const existingPlayer = players.find((player) => player.roomId === roomId && player.username === username);

    // username or RoomId missing
    if(existingPlayer) return { error: 'Der angegebene Username ist schon in Verwendung.' };

    // adding player
    const player = { socketId, username, roomId };
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
    return players.filter((player) => player.roomId == roomId);
}

module.exports = { addPlayer, removePlayer, getPlayer, getPlayersInRoom };