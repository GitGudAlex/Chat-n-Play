
const { getPlayer, getPlayersInRoom } = require('../models/players');
const { getRoom } = require('../models/rooms');
const { Deck } = require('./Cards/Deck');
const { Hand } = require('./Cards/Hand'); 

const initUno = (hostId, socket, io) => {
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

    /**
     * Wenn sich eine Farbe gewünscht wird
     * 
     * 0 = blau
     * 1 = rot
     * 2 = orange
     * 3 = grün
     */
    room['nextColor'] = -1;

    // Ob der Spieler aussetzen muss
    room['isSkip'] = false;

    // Wenn +2 oder +4 Karten gelegt werden -> aufaddieren
    room['cardsCount'] = 0;

    // Der aktuelle Spieler
    room['activePlayer'] = 0;

    /**
     * Der Nächste Input der erwartet wird
     * 
     * 1 = Karte ablegen
     * 2 = Farbauswahl
     * 3 = +2 / +4 => Ob man eine weitere +2 / +4 Karte drauflegen kann oder ob man ziehen muss
     * 4 = Klopf Klopf
     */
    room['moveType'] = 1;

    // Jedem Spieler 7 Karten geben
    const players = getPlayersInRoom(player.roomId);

    // Die Hand erstellen
    for(let player of players) {
        player['hand'] = new Hand();

    }

    let cardCounter = 0;
    let playerCounter = 0;

    const dealHandCards = () => {
        setTimeout(() => {
            // Hand Karten verteilen
            let card = room.deck.takeCard();
            players[playerCounter].hand.addCard(card);

            // Sich selber die Karte schicken
            io.to(players[playerCounter].socketId).emit('uno:deal-card', { card: card });

            // Den anderen die Karte schicken (Nur ohne Wert)
            socket.to(room.roomId).emit('uno:deal-card', { card: { id: card.id, path: '-1.png' } });

            // Wenn 7 Karten verteilt wurden
            if(cardCounter < 7) {

                // Wenn jeder Spieler einmal durchgegangen ist -> von vorne anfangen
                if(++playerCounter >= players.length) {
                    playerCounter = 0;
                    cardCounter++;

                }

                dealHandCards();
            } else {
                setFirstPlayer(room, players, io);

            }
        }, 500);
    }

    dealHandCards();

}

const setFirstPlayer = (room, players, io) => {

    setTimeout(() => {
        // Zufällig den ersten Spieler auswählen
        let firstPlayer = players[Math.floor(Math.random() * players.length)];

        // Aktiven Spieler speichern
        room.activePlayer = firstPlayer;

        // Allen Spielern die SocketId des nächsten Spielers schicken
        io.in(firstPlayer.roomId).emit('uno:set-first-player', { socketId: firstPlayer.socketId });
    }, 1000);
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

const setNextPlayer = (io, roomId) => {
    let nextPlayer = getNextPlayer(roomId);

    let room = getRoom(roomId);

    // Spieler muss aussetzten
    if(room.isSkip === true) {
        nextPlayer = getNextPlayer(roomId);
    }

    io.in(roomId).emit('uno:set-next-player', { socketId: socketId });
}

module.exports = { initUno, getNextPlayer, setNextPlayer }