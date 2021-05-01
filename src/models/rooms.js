const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

/**
 * { roomId, gameTypeId, hostId, maxPlayers, hasStarted }
 */
const rooms = [];

// add a room
const addRoom = ( gameTypeId, hostId ) => {
    let roomId = uuid.v4();

    // falls es zufälligerweise schon die gleiche ID gibt
    while (rooms.find((room) => room.roomId === roomId)) {
        roomId = uuid.v4();
    }
 
    // get max players
    const json = fs.readFileSync(path.join(__dirname + '/../data/games.json'));
    const obj = JSON.parse(json);

    const game = obj.find(game => game.id == gameTypeId);

    // adding room
    const room = { roomId, gameTypeId, hostId, maxPlayers: game.maxPlayers, hasStarted: false };
    rooms.push(room);
 
    // returning room object
    return room;
}
 
// remove a room
const removeRoom = (roomId) => {
    const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

    if(roomIndex != -1) {
        const room = rooms[roomIndex];
        rooms.splice(roomIndex, 1)

        return room;
    }

    return false;
}

// gets the room Object by the roomId
const getRoom = (roomId) => {
    return rooms.find((room) => room.roomId === roomId);
}

// checks if a given player is the current host in a game
const isHost = (socketId) => { 
    let room = rooms.find((room) => room.hostId === socketId);
    return (room === undefined) ? false : true;
}

// checks if a given player is the current host in a game
const getHost = (roomId) => { 
    let room = rooms.find((room) => room.roomId === roomId);
    return room.hostId;
}

// sets the new host for a room
const setHost = (roomId, hostId) => { 
    let roomIndex = rooms.findIndex((room) => room.roomId === roomId);
    rooms[roomIndex].hostId = hostId;
}
 
// sets the variable, that the game has started
const setGameStarted = (roomId, hasStarted) => { 
    let roomIndex = rooms.findIndex((room) => room.roomId === roomId);
    rooms[roomIndex].hasStarted = hasStarted;
}

module.exports = { addRoom, removeRoom, getRoom, isHost, getHost, setHost, setGameStarted };