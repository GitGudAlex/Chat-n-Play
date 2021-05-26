
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
    room['reverse'] = false;

    // Wenn +2 oder +4 Karten gelegt werden -> aufaddieren
    room['cardsCount'] = 0;

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

module.exports = { initUno }