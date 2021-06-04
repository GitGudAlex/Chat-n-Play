import { useCallback, useContext, useEffect, useState } from 'react';
import $ from 'jquery';

import './UnoGameBoard.css';

import SocketContext from "../../../services/socket";
import UnoCard from '../UnoCard/UnoCard';

function UnoGameBoard(props) {

    const [lastCards, setLastCards] = useState([]);
    const [activeCard, setActiveCard] = useState();

    // Socket.io
    const socket = useContext(SocketContext);

    const animateCard = useCallback((fromId, toId, card, flip, callback) => {

        // Laufzeit
        let duration = 500;

        // Startzeitpunkt der Animation
        let startTime;

        // Breite der Karte hohlen
        let sidebarWidth = $('#sidebar-wrapper').width();

        var fromElement = document.getElementById(fromId).getBoundingClientRect();
        var toElement = document.getElementById(toId).getBoundingClientRect();

        // X Werte -> Verschiebung
        let startPositionX = 0;

        let startPosAbsX = fromElement.left - sidebarWidth;
        let endPosAbsX = toElement.left - sidebarWidth;
        let endPositionX = endPosAbsX - startPosAbsX;

        // Y Werte -> Verschiebung
        let startPositionY = 0;
        
        let startPosAbsY = fromElement.top;
        let endPosAbsY = toElement.top;
        let endPositionY = endPosAbsY - startPosAbsY;

        // Z Rotation
        let startRotationZ = 0;
        let endRotationZ = card.rotation;

        // Y Rotation
        let startRotationY = 0;
        let endRotationY = -180;

        // Animationsfunktion
        const easeOutCirc = (x) => {
            return 1 - (1 - x) * (1 - x);
        }

        const initAnimation = (timestamp) => {
            startTime = timestamp;

            $('#' + card.id + '-animate-wrapper').css({ transform: 'rotateZ(' + startPositionY + 'deg)' });
            $('#' + card.id + '-animate-wrapper').css({ left: startPosAbsX + 'px' });
            $('#' + card.id + '-animate-wrapper').css({ top: startPosAbsY + 'px' });
            $('#' + card.id + '-animate').css({ transform: 'rotateY(' + startRotationY + 'deg)' });

            $('#' + card.id + '-animate-wrapper').removeClass('invisible');

            requestAnimationFrame(animate);
        }

        const animate = (timestamp) => {
            if(timestamp - startTime < duration) {
                let p = (timestamp - startTime) / duration;
                let val = easeOutCirc(p);

                // Für das verschieben in X Richtung
                let posX = startPositionX + (endPositionX - startPositionX) * val;

                // Für das verschieben in Y Richtung
                let posY = startPositionY + (endPositionY - startPositionY) * val;

                // Für die Z Rotation
                let rotZ = startRotationZ + (endRotationZ - startRotationZ) * val;

                // Für die Y Rotation
                let rotY = startRotationY + (endRotationY - startRotationY) * val;
                
                $('#' + card.id + '-animate-wrapper').css({ transform: 'rotateZ(' + rotZ + 'deg)' });
                $('#' + card.id + '-animate-wrapper').css({ left: startPosAbsX + posX + 'px' });
                $('#' + card.id + '-animate-wrapper').css({ top: startPosAbsY + posY + 'px' });

                $('#' + card.id + '-animate').css({ transform: 'rotateY(' + rotY + 'deg)' });

                requestAnimationFrame(animate);

            } else {
                $('#' + card.id + '-animate-wrapper').addClass('invisible');
                callback();
            }
        }

        requestAnimationFrame(initAnimation);
    }, []);

    const handleDealCardEvent = useCallback((data) => {

        // Karte kommt vom Kartenstapel und wird abgelegt
        if(data.socketId === 0) {

            // Zufällige Rotation zwischen -15 und + 15 Grad
            let rotation = Math.floor(Math.random() * 30) - 15; 
            data.card.rotation = rotation;

            setActiveCard(
                <UnoCard card={ data.card } hidden={ true } flip={ true }/>
            );

            animateCard('uno-deal-deck-img', 'uno-discard-deck-ref', data.card, true, () => {
                setLastCards(cards => {
                    if(cards.length === 6) {
                        return [...cards.slice(1, cards.length), data.card]
    
                    } else {
                        return [...cards, data.card]
    
                    }
                    
                });

                setActiveCard();
            });
        }
    }, [animateCard]);

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