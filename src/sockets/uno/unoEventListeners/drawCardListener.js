const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { setNextPlayer } = require("../../../uno/gameLogic");

module.exports = (io, socket) => {

    // aktuellen Spieler bekommen
    const player = getPlayer(socket.id);

    // Spieler exestiert noch nicht
    if(player === undefined) return;

    // aktuellen Raum bekommen
    const room = getRoom(player.roomId);

    // Raum exestiert nicht
    if(room === undefined) return;

    // Falsches Spiel
    if(room.gameTypeId !== 1) return;

    // Noch nicht gestartet
    if(room.hasStarted === false) return;

    // Spieler nicht an der Reihe
    if(room.activePlayer.roomId !== socket.id) return;

    // Spiel noch nicht angefangen
    if(room.cardOnBoard === 0) return;

    const drawCard = (numCards) => {
        setTimeout(() => {
            let card = room.deck.takeCard();
            player.hand.addCard(card);
            
            io.in(room.roomId).emit('uno:give-draw-card', { card: card });

            // noch eine Karte ziehen
            if(--numCards !== 0) {
                drawCard(numCards);

            // Alle Karten gezogen
            } else {
                setNextPlayer(io, room.roomId);

            }
        }, 500);
    }

    // Normaler Zug => Eine Karte nehmen
    if(room.moveType === 1) {
        drawCard(1);

    // Karten ziehen wegen +2 oder +4 Karten
    } else if(room.moveType === 3) {
        drawCard(room.cardsCount);

        // Card Count reseten
        room.cardsCount = 0;

        // Karten wurden gezogen => nächster muss keine Karten mehr ziehen
        room.moveType = 1;

    }
}