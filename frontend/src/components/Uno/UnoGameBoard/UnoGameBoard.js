import { useCallback, useContext, useEffect, useState } from 'react';

import './UnoGameBoard.css';

import SocketContext from "../../../services/socket";
import UnoCard from '../UnoCard/UnoCard';

import { animateCard } from '../Animations/CardAnimation';
import UnoHand from '../UnoHand/UnoHand';

function UnoGameBoard(props) {

    const [lastCards, setLastCards] = useState([]);
    const [activeCard, setActiveCard] = useState();

    // Socket.io
    const socket = useContext(SocketContext);

    const handleDealCardEvent = useCallback((data) => {

        // Karte kommt vom Kartenstapel und wird abgelegt
        if(data.socketId === 0) {

            // Zufällige Rotation zwischen -15 und + 15 Grad
            let rotation = Math.floor(Math.random() * 30) - 15; 
            data.card.rotation = rotation;

            setActiveCard(
                <UnoCard card={ data.card } hidden={ true } animate={ true } />
            );

            animateCard('uno-deal-deck-img', 'uno-discard-deck-ref', data.card, 500, true, false, () => {
                setLastCards(cards => {
                    if(cards.length === 6) {
                        return [...cards.slice(1, cards.length), data.card]
    
                    } else {
                        return [...cards, data.card]
    
                    }
                    
                });

                setActiveCard();
            });

        // Karte wird an einen Spieler verteilt
        } else {
            setActiveCard(
                <UnoCard card={ data.card } hidden={ true } animate={ true } />
            );

            // Eigene Karte
            if(data.socketId === socket.id) {
                animateCard('uno-deal-deck-img', data.socketId + '-uno-player', data.card, 600, true, false, () => {
                    setActiveCard();
                });

            // Karte eines Gegenspielers
            } else {
                animateCard('uno-deal-deck-img', data.socketId + '-uno-player', data.card, 600, false, true, () => {
                    setActiveCard();
                });
            }
        }
    }, [socket]);

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
    }, [socket, handleDealCardEvent, handleSetFirstPlayerEvent]);

    return (
        <div id='uno-gameboard' >
            <div id='uno-deal-deck'>
                <img id='uno-deal-deck-img' className='uno-card' src={ '/UnoCardsImages/-1.png' } alt={ 'Rückseite einer Karte' }/>
            </div>
            <div id='uno-discard-deck'>
                <img id='uno-discard-deck-ref' className='uno-card invisible' src={ '/UnoCardsImages/-1.png' } alt='Referenz Bild' />
                {
                    lastCards.map(card => {
                        return <UnoCard key={ card.id } card={ card } />
                    })
                }
            </div>
            {
                activeCard !== undefined ? (
                    activeCard
                ) : (
                    <div />
                )
            }
        </div>
    );
}

export default UnoGameBoard;