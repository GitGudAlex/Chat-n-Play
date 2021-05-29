import { useCallback, useContext, useEffect, useState } from 'react';

import './UnoGameBoard.css';

import SocketContext from "../../../services/socket";
import UnoCard from '../UnoCard/UnoCard';
import UnoHand from '../UnoHand/UnoHand';

function UnoGameBoard(props) {

    const [playedCard, setPlayedCard] = useState();
    const [lastCards, setLastCards] = useState([]);

    // Socket.io
    const socket = useContext(SocketContext);

    const handleDealCardEvent = useCallback((data) => {

        // Karte kommt vom Kartenstapel
        if(data.socketId === 0) {
            setPlayedCard(data.card);

            // Zufällige Rotation zwischen -15 und + 15 Grad
            let rotation = Math.floor(Math.random() * 30) - 15; 

            data.card.rotation = rotation;

            setLastCards(cards => {
                if(cards.length === 6) {
                    return [...cards.slice(1, cards.length), data.card]

                } else {
                    return [...cards, data.card]

                }
            });
        }
    }, []);

    // Setzt am Anfang den Spieler
    const handleSetFirstPlayerEvent = useCallback(() => {

        // Wenn die Animation zuende ist
        if(props.isHost) {
            socket.emit('uno:select-random-player-animation-ready');
        }
    }, [socket, props]);

    useEffect(() => {
        socket.on('uno:deal-card', handleDealCardEvent);
        socket.on('uno:set-first-player', handleSetFirstPlayerEvent);

        return () => {
            socket.off('uno:deal-card', handleDealCardEvent);
            socket.off('uno:set-first-player', handleSetFirstPlayerEvent);
        }
    }, [socket, handleDealCardEvent, handleSetFirstPlayerEvent, handleDealCardEvent]);

    return (
        <div id='uno-gameboard'>
            <div id='uno-deal-deck'>
                <img id='uno-deal-deck-img' className='uno-card' src={ '/UnoCardsImages/-1.png' } alt={ 'Rückseite einer Karte' }/>
            </div>
            <div id='uno-discard-deck'>
                {
                    lastCards.map((card, index) => {
                        if(index === lastCards.length - 1) {
                            return <UnoCard key={ card.id + '-animation' } fromId={ 'uno-deal-deck-img' } toId={ 'uno-discard-deck' } card={ card } flip={ true } />
                        }

                        return <UnoCard key={ card.id } card={ card } />
                    })
                }
            </div>
            
            {
                props.players.map((player) => {

                    // Der eigene Spieler -> Große Hand
                    if(player.socketId === socket.id) {
                        return <UnoHand self={ true } />
                    }

                    // Anderer Spieler -> Kleine Hand
                    return <UnoHand self={ false } />
                })
            }

        </div>
    );
}

export default UnoGameBoard;