const { removeRoom, isHost, setHost, getRoom } = require('../models/rooms');
const { removePlayer, getPlayersInRoom, getColors, reorderPlayerPositions } = require('../models/players');

/**
 * {roomId, [alphabet]}
 */
const roomLetters = []


const initilazeGame = (roomId, categories, rounds) => {
    const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
    roomLetters.push({ roomId, alphabet });

    // Raum weiter Attribute hinzufügen
    const room = getRoom(roomId);

    room['categories'] = categories;
    room['rounds'] = rounds;

    // Alle Spieler aus dem Raum des 
    const allPlayers = getPlayersInRoom(roomId);

    // Spielern weitere Attribute hinzufügen
    allPlayers.forEach(player => {
        player['score'] = 0; 
    });

    let playerScores = allPlayers.map((player) => {
        let playerObj = { username: player.username, score: player.score };
        
        return playerObj;
    });
    
    return playerScores;
}


const chooseLetter = (roomId) => {
    let letters = roomLetters.filter((item) => item.roomId === roomId)[0].alphabet;
    let index = Math.floor(Math.random() * letters.length);
    
    let choosenLetter = letters[index];
    letters.splice(index, 1);

    return choosenLetter;
}


module.exports = { initilazeGame, chooseLetter };