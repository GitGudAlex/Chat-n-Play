import { useCallback, useContext, useEffect, useState } from 'react';

import './UnoGameBoard.css';

import SocketContext from "../../../services/socket";
import UnoCard from '../UnoCard/UnoCard';

function UnoGameBoard(props) {

    const [playedCard, setPlayedCard] = useState();
    const [lastCards, setLastCards] = useState([]);

    // Socket.io
    const socket = useContext(SocketContext);

    // Karten mischen
    const handlingDealStartHand = useCallback((data) => {

        // Wenn die Animation zuende ist
        if(props.isHost) {
            socket.emit('uno:deal-start-cards-animation-ready');
        }

    }, [socket, props]);

    // Der Server liefert einen zufälligen Start Spieler -> Animation abspielen
    const handlingSetStartPlayer = useCallback((data) => {

    }, []);

    // Setzt am Anfang den Spieler
    const handleSetForstPlayerEvent = useCallback(() => {

        // Wenn die Animation zuende ist
        if(props.isHost) {
            socket.emit('uno:select-random-player-animation-ready');
        }
    }, [socket, props]);

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

    useEffect(() => {
        socket.on('uno:deal-start-hand', handlingDealStartHand);
        socket.on('uno:set-start-player', handlingSetStartPlayer);
        socket.on('uno:set-first-player', handleSetForstPlayerEvent);
        socket.on('uno:deal-card', handleDealCardEvent);

        return () => {
            socket.off('uno:deal-start-hand', handlingDealStartHand);
            socket.off('uno:set-start-player', handlingSetStartPlayer);
            socket.off('uno:set-first-player', handleSetForstPlayerEvent);
            socket.off('uno:deal-card', handleDealCardEvent);
        }
    }, [socket, handlingDealStartHand, handlingSetStartPlayer, handleSetForstPlayerEvent, handleDealCardEvent]);

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
        </div>
    );
}

export default UnoGameBoard;