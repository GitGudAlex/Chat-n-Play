const uuid = require('uuid');

/**
 * { roomId, gameTypeId, hostId }
 */
const rooms = [];

// add a room
const addRoom = ( gameTypeId, hostId ) => {
    let roomId = uuid.v4();

    // falls es zufälligerweise schon die gleiche ID gibt
    while (rooms.find((room) => room.roomId === roomId)) {
        roomId = uuid.v4();
    }
 
    // adding room
    const room = { roomId, gameTypeId, hostId };
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
 
module.exports = { addRoom, removeRoom, getRoom, isHost, getHost, setHost };