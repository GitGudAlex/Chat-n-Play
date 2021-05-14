const { removeRoom, isHost, setHost, getRoom } = require('../models/rooms');
const { removePlayer, getPlayersInRoom, getColors, reorderPlayerPositions, getPlayer } = require('../models/players');

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
    room['currentRound'] = 0;

    // Alle Spieler aus dem Raum des 
    const allPlayers = getPlayersInRoom(roomId);

    // Spielern weitere Attribute hinzufügen
    allPlayers.forEach(player => {
        player['score'] = 0;
        player['words'] = []; 
    });

    let playerScores = allPlayers.map((player) => {
        let playerObj = { username: player.username, score: player.score };
        
        return playerObj;
    });
    
    return playerScores;
}


const chooseLetter = (roomId) => {
    const room = getRoom(roomId);

    if(room['currentRound'] < room['rounds']) {
        let letters = roomLetters.filter((item) => item.roomId === roomId)[0].alphabet;
        let index = Math.floor(Math.random() * letters.length);
        
        let choosenLetter = letters[index];
        letters.splice(index, 1);

        // Runde +1
        room['currentRound'] += 1;

        return choosenLetter;
    }

    return undefined;
}


const submitWords = (socketId, words) => {
    const player = getPlayer(socketId);

    player['words'].append(words);
}


const getWordsFromAllPlayers = () => {

}




module.exports = { initilazeGame, chooseLetter };