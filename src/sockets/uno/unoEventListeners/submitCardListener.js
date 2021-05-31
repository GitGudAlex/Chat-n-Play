const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { setNextPlayer } = require("../../../uno/gameLogic");

module.exports = (io, socket, data) => {
    
    // aktuellen Spieler bekommen
    const player = getPlayer(socket.id);

    // Spieler exestiert noch nicht
    if(player === undefined) return;

    const room = getRoom(player.roomId);

    if(room === undefined) return;

    // Spieler ist gerade dran
    if(room.acticePlayer.socketId === player.socketID) {

        // Normaler Zug
        if(room.moveType === 1) {

            // Karte schwarz -> Darf gelegt werden
            if(data.card.color === 4) {
                placeCard(data.card);

            } else {

                // Gleiche Farbe oder gleiche Zahl
                if(room.cardOnBoard.value === data.card.value || room.cardOnBoard.color === data.card.color) {
                    placeCard(data.card);
                }
            }

        // Farbwahl
        } else if(room.moveType === 2) {

            // Gewünschte Farbe
            if(room.nextColor === data.card.value || data.card.value === 4) {
                placeCard(data.card);

            }

        // +2 oder +4 Karte liegt unten
        } else if(room.moveType === 3) {

            // Man selber muss auch eine +2 oder +4 Karte legen
            if(data.card.value === 10 || (data.card.color === 4 && data.card.value === 0 )) {
                placeCard(data.card);
            }

        }

    // Spieler ist gerade nicht dran
    } else {

        // Exakt gleiche Karte
        if(room.cardOnBoard.value === data.card.value && room.cardOnBoard.color === data.card.color) {
            placeCard(data.card);
        }

    }

    const placeCard = (card) => {
        
        // Besondere Karte
        if(card.isSpecial()) {

            // +2 Karte
            if(card.value === 10) {
                room.cardsCount += 2;
                room.moveType = 3;
                
            // Reverse Karte
            } else if(card.value === 11) {
                room.isReverse = !room.isReverse;
                room.moveType = 1;

            // Aussetz Karte
            } else if(card.value === 12) {
                room.isSkip = true;
                room.moveType = 1;

            // Schwarze Farbe
            } else {

                // +4
                if(card.value === 0) {
                    room.cardsCount += 4;
                    room.moveType = 3;

                // Farbe aussuchen
                } else if(card.value === 1) {
                    room.moveType = 2;
                    

                // Klopf Klopf
                } else if(card.value === 2) {
                    room.moveType = 4;

                }

            }

        // Normaler Karte
        } else {
            room.moveType = 1;

        }

        room.cardOnBoard = card;
        setNextPlayer(io, room.roomId);
    }

}