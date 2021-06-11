const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { setNextPlayer, dealCard } = require("../../../uno/gameLogic");

module.exports = (io, socket, data) => {
    
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

    // Spiel noch nicht angefangen
    if(room.cardOnBoard === 0) return; 

    const placeCard = (card) => {

        if(player.active === false) return;

        // Spieler kann nicht mehr interagieren
        player.active = false;

        const isSpecial = (card) => {
            if(card.color === 4) {
                return true;
            }
    
            if(card.value > 9) {
                return true;
            }
    
            return false;
        }
        
        // Besondere Karte
        if(isSpecial(card)) {

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

        player.hand.discard(card);
        room.cardOnBoard = card;

        io.to(room.roomId).emit('uno:card-played', { card: card, socketId: player.socketId });

        setTimeout(() => {
            // Ob man vergessen hat 'KlopfKlopf' zu sagen / zu drücken
            if(player.hand.getHandSize() === 1) {

                // Wurde vergessen => +1 Karte ziehen
                if(!player.klopfKlopf) {
                    dealCard(io, room, player, false);

                    // Nächste Runde
                    setNextPlayer(io, room.roomId);

                } else {
                    // resetten
                    player.klopfKlopf = false;
                }

            // Wenn ein Spieler keine Karten mehr hat => gewonnen
            } else if (player.hand.getHandSize() === 0) {
                io.in(player.roomId).emit('room:end-game', { winners: [player] });

            // Nächster Spieler ist dran
            } else {
                setNextPlayer(io, room.roomId);
            }
        }, 1000);
    }

    // Spieler ist gerade dran
    if(room.activePlayer.socketId === player.socketId) {

        // Ob man überhaupt die Karte besitzt
        if(player.hand.hasCard(data.card.id) === false) return;

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

            // Alten Spieler inaktiv setzten
            let oldPlayer = getPlayer(room.activePlayer.socketId);
            oldPlayer.active = false;

            // Neuen aktiven Spieler setzten
            room.activePlayer = { socketId: player.socketId, position: player.position };
            player.active = true;
            
            placeCard(data.card);
        }

    }
}