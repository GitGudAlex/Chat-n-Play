
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

        // Ob man klopfklopf gesagt / gedrückt hat wenn man nur noch eine Karte oder 2 hat.
        player['klopfKlopf'] = false;

    }

    let cardCounter = 0;

    const dealHandCards = () => {
        setTimeout(() => {
            // Nächster Spieler
            let nextPlayer = getNextPlayer(room.roomId);

            // Hand Karten verteilen
            let card = room.deck.takeCard();
            nextPlayer.hand.addCard(card);

            // Sich selber die Karte schicken
            io.to(nextPlayer.socketId).emit('uno:deal-card', { card: card, socketId: nextPlayer.socketId });

            // Den anderen die Karte schicken (Nur ohne Wert)
            (io.sockets.sockets.get(nextPlayer.socketId)).to(room.roomId).emit('uno:deal-card', { card: { id: card.id, path: '-1.png' }, socketId: nextPlayer.socketId });

            // Wenn 7 Karten verteilt wurden
            if(++cardCounter < 7 * players.length) {

                dealHandCards();

            } else {
                setFirstPlayer(room, players, io);

            }
        }, 800);
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

// Reihnfolge der Positionen
const order = [0, 2, 1, 3]

const getNextPlayer = (roomId) => {
    
    const room = getRoom(roomId);

    // Ob die Reihnfolge zurzeit umgekehrt ist
    let isReverse = room.isReverse;

    // Alle Spieler
    const players = getPlayersInRoom(roomId);

    // Den Aktuell aktiven Spieler hohlen
    let activePlayer = room.activePlayer;

    // Position des Spielers
    let currentPosition = activePlayer.position;

    // Position des Spielers im Array
    let orderIndex = order.findIndex(p => p === currentPosition);

    // Normale Reihnfolge
    if(!isReverse) {

        // Man kann nicht einfach die nächste Position nehmen, da ein Spieler disconnectet sein kann.
        // Nach dem Start des Spiels akualisieren sich die Positionen nicht mehr
        for(let i = orderIndex + 1; i < orderIndex + 4; i++) {
            let newOrderIndex = i % 4;
            let newPosition = order[newOrderIndex];

            let newPlayerIndex = players.findIndex(p => p.position === newPosition);
            
            // Nächster Spieler wurde gefunden
            if(newPlayerIndex !== -1) {
                let newPlayer = players[newPlayerIndex];

                // TODO: Vlt ganzen Spieler abspeichern
                room.activePlayer = { socketId: newPlayer.socketId, position: newPlayer.position };
                return newPlayer;
            }
        }

    // umgekehrt Reihnfolge
    } else {

        // Man kann nicht einfach die nächste Position nehmen, da ein Spieler disconnectet sein kann.
        // Nach dem Start des Spiels akualisieren sich die Positionen nicht mehr
        for(let i = positionIndex - 1; i > positionIndex - players.length; i--) {
            let newPositionIndex = i % players.length;

            // z.B. 4 % 4 sollte 4 sein und nicht 0
            if(newPositionIndex === 0) {
                newPositionIndex = players.length;
            }

            let newPosition = order[newPositionIndex];

            let newPlayerIndex = players.findIndex(p => p.position === newPosition);

            // Nächster Spieler wurde gefunden
            if(newPlayerIndex !== -1) {
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
        room.isSkip = false;

        room.moveType = 1;
    }

    io.in(roomId).emit('uno:set-next-player', { socketId: socketId });
}

module.exports = { initUno, getNextPlayer, setNextPlayer }