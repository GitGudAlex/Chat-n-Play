
const { getPlayer, getPlayersInRoom } = require('../models/players');
const { getRoom } = require('../models/rooms');
const { Deck } = require('./Cards/Deck');
const { Hand } = require('./Cards/Hand'); 

const initUno = (hostId, callback) => {
    const player = getPlayer(hostId);

    // Falls der Spieler in keinem Raum ist
    if(player === undefined) return;

    // Raum des Spiels bekommen
    const room = getRoom(player.roomId);

    // Neue Attribute für den Raum setzten

    // Das Kartendeck
    let deck = new Deck();
    deck.shuffle();

    room['deck'] = deck;

    // Die aktuell oberste abgelegte Karte
    room['cardOnBoard'] = 0;

    // Wenn die Richtung umgedreht wird
    room['isReverse'] = false;

    // Wenn +2 oder +4 Karten gelegt werden -> aufaddieren
    room['cardsCount'] = 0;

    // Der aktuelle Spieler
    room['activePlayer'] = 0;

    // Jedem Spieler 7 Karten geben
    const players = getPlayersInRoom(player.roomId);

    for(let player of players) {
        let hand = new Hand();

        for(let i = 0; i < 7; i++) {

            // Karte vom Deck der Hand hinzufügen
            hand.addCard(room.deck.takeCard());
        }

        player['hand'] = hand;
    }

    callback();
}


const getNextPlayer = (roomId) => {
    
    const room = getRoom(roomId);

    // Den Aktuell aktiven Spieler hohlen
    let activePlayer = room.activePlayer;
    let currentPlayerPosition = activePlayer.position;

    // Ob die Reihnfolge zurzeit umgekehrt ist
    let isReverse = room.isReverse;

    // Alle Spieler
    const players = getPlayersInRoom(roomId);

    // Normale Reihnfolge
    if(!isReverse) {

        // Man kann nicht einfach die nächste Position nehmen, da ein Spieler disconnectet sein kann.
        // Nach dem Start des Spiels akualisieren sich die Positionen nicht mehr
        for(let i = currentPlayerPosition + 1; i < currentPlayerPosition + players.length; i++) {
            let newPosition = i % players.length;

            // z.B. 4 % 4 sollte 4 sein und nicht 0
            if(newPosition === 0) {
                newPosition = players.length;
            }

            let newPlayerIndex = players.findIndex(p => p.position === newPosition);

            // Nächster Spieler wurde gefunden
            if(newPlayerIndex !== undefined) {
                let newPlayer = players[newPlayerIndex];

                room.activePlayer = { socketId: newPlayer.socketId, position: newPlayer.position };
                return newPlayer;
            }
        }

    // umgekehrt Reihnfolge
    } else {

        // Man kann nicht einfach die nächste Position nehmen, da ein Spieler disconnectet sein kann.
        // Nach dem Start des Spiels akualisieren sich die Positionen nicht mehr
        for(let i = currentPlayerPosition - 1; i > currentPlayerPosition - players.length; i--) {
            let newPosition = i % players.length;

            // z.B. 4 % 4 sollte 4 sein und nicht 0
            if(newPosition === 0) {
                newPosition = players.length;
            }

            let newPlayerIndex = players.findIndex(p => p.position === newPosition);

            // Nächster Spieler wurde gefunden
            if(newPlayerIndex !== undefined) {
                let newPlayer = players[newPlayerIndex];
                
                room.activePlayer = { socketId: newPlayer.socketId, position: newPlayer.position };
                return newPlayer;
            }
        }

    }
}

module.exports = { initUno, getNextPlayer }