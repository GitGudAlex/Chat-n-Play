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
    room['currentRound'] = -1;
    room['evaluatingRound'] = false;

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

        // Die Wörter aus der letzten Runde löschen
        room['currentWords'] = [];

        // Wird auf true gesetzt, wenn die Wörter bewertet werden
        room['evaluatingRound'] = false;

        // Der in der aktuellen Runde benutzter Buchstabe
        room['currentLetter'] = choosenLetter;

        return choosenLetter;
    }

    return undefined;
}


const submitWords = (socketId, words, allSubmittedCallback) => {
    const player = getPlayer(socketId);
    const room = getRoom(player.roomId);

    let result = { socketId, words: [] };

    words.forEach((word) => {
        result.words.push({ word: word, votes: 0 });
    });

    player['words'][room.currentRound] = words;
    room['currentWords'].push(result);

    const playerNum = getPlayersInRoom(room.roomId).length;

    if(playerNum == room['currentWords'].length) {
        room['evaluatingRound'] = true;
        allSubmittedCallback(room['currentWords'], room['currentLetter']);
    }
}


const removePlayerWordsFromCurrentRound = (player) => {
    const room = getRoom(player.roomId);

    let currentWords = room['currentWords'];
    let playerWordsIndex = currentWords.findIndex(entry => entry.socketId === player.socketId);

    currentWords.splice(playerWordsIndex, 1)

    return currentWords;
}

module.exports = { initilazeGame, chooseLetter, submitWords, removePlayerWordsFromCurrentRound };