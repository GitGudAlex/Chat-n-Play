import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import './UnoGameBoard.css';

import SocketContext from "../../../services/socket";
import UnoCard from '../UnoCard/UnoCard';

import { animateCard } from '../Animations/CardAnimation';
import UnoHand from '../UnoHand/UnoHand';

function UnoGameBoard(props) {

    // Die zuletzt gespielten karten (welche auf dem Kartenstapel liegen)
    const [lastCards, setLastCards] = useState([]);

    // Karten für die animationen
    const activeCardsRef = useRef([]);
    const [activeCards, setActiveCards] = useState([]);

    // Die Hand Karten für jeden Spieler
    const handCardsRef = useRef([[], [], [], []]);
    const [handCards, setHandCards] = useState([[], [], [], []]);

    const activeCardsCounterRef = useRef(0);

    // Socket.io
    const socket = useContext(SocketContext);

    const handleDealCardEvent = useCallback((data) => {

        data.card.socketId = data.socketId;

        // Karte kommt vom Kartenstapel und wird abgelegt
        if(data.socketId === 0) {

            // Zufällige Rotation zwischen -15 und + 15 Grad
            let rotation = Math.floor(Math.random() * 30) - 15; 
            data.card.rotation = rotation;
            
            // Animations Karte hinzufügen
            let card = <UnoCard key={ data.card.id } card={ data.card } hidden={ true } animate={ true } />

            activeCardsRef.current.push(card);
            setActiveCards([...activeCardsRef.current]);

            activeCardsCounterRef.current += 1;

            // Animation abspielen
            animateCard('uno-deal-deck-img', 'uno-discard-deck-ref', data.card, 500, true, false, undefined, () => {
                
                // Zuletzt gespielte Karten updaten
                setLastCards(cards => {
                    if(cards.length === 6) {
                        return [...cards.slice(1, cards.length), data.card]
    
                    } else {
                        return [...cards, data.card]
    
                    }
                    
                });

                let index = activeCardsRef.current.findIndex(c => c.props.card.id === data.card.id);
                activeCardsRef.current.splice(index, 1);

                setActiveCards(activeCardsRef.current);

                activeCardsCounterRef.current -= 1;

                // Wenn nur noch eine Karte übrig ist
                if(activeCardsCounterRef === 0) {
                    activeCardsRef.current = [];
                    setActiveCards([...activeCardsRef.current]);
                }
            });
            
        // Ein Spieler bekommt eine Karte
        } else {

            // Der eigene Spieler bekommt eine Karte
            if(data.socketId === socket.id) {

                // Animations Karte hinzufügen
                let card = <UnoCard key={ data.card.id } card={ data.card } hidden={ true } animate={ true } />

                activeCardsRef.current.push(card);
                setActiveCards([...activeCardsRef.current]);

                activeCardsCounterRef.current += 1;

                // Animation abspielen
                animateCard('uno-deal-deck-img', 'uno-deck-ref-' + data.card.id, data.card, 600, true, false, 'uno-deck-ref-scaling-' + data.card.id, () => {

                    // Karte der Hand hinzufügen
                    let playerIndex = props.players.findIndex(p => p.socketId === data.socketId);
                    let playerPosition = props.players[playerIndex].position;

                    handCardsRef.current[playerPosition].push(data.card);
                    setHandCards([...handCardsRef.current]);

                    // Animationskarte löschen
                    let index = activeCardsRef.current.findIndex(c => c.props.card.id === data.card.id);
                    activeCardsRef.current.splice(index, 1);

                    setActiveCards(activeCardsRef.current);

                    activeCardsCounterRef.current -= 1;

                    // Wenn nur noch eine Karte übrig ist
                    if(activeCardsCounterRef.current === 0) {
                        activeCardsRef.current = [];
                        setActiveCards([...activeCardsRef.current]);
                    }
                });

            // Ein Gegenspieler bekommt eine Karte
            } else {

                // Animations Karte hinzufügen
                let card = <UnoCard key={ data.card.id } card={ data.card } hidden={ true } animate={ true } />

                activeCardsRef.current.push(card);
                setActiveCards([...activeCardsRef.current]);

                activeCardsCounterRef.current += 1;

                // Animation abspielen
                animateCard('uno-deal-deck-img', 'uno-deck-ref-' + data.card.id, data.card, 600, false, true, 'uno-deck-ref-scaling-' + data.card.id, () => {

                    // Karte der Hand hinzufügen
                    let playerIndex = props.players.findIndex(p => p.socketId === data.socketId);
                    let playerPosition = props.players[playerIndex].position;

                    handCardsRef.current[playerPosition].push(data.card);
                    setHandCards([...handCardsRef.current]);

                    // Animationskarte löschen
                    let index = activeCardsRef.current.findIndex(c => c.props.card.id === data.card.id);
                    activeCardsRef.current.splice(index, 1);

                    setActiveCards(activeCardsRef.current);

                    activeCardsCounterRef.current -= 1;

                    // Wenn nur noch eine Karte übrig ist
                    if(activeCardsCounterRef.current === 0) {
                        activeCardsRef.current = [];
                        setActiveCards([...activeCardsRef.current]);
                    }
                });
            }
        }
    }, [socket, props.players]);

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
            <div id='uno-deck-wrapper'>
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
            </div>
            {
                props.players.map(p => {
                    let activeCardsList = [];

                    for(let card of activeCards) {
                        if(card.props.card.socketId === p.socketId) {
                            activeCardsList.push(card);
                        }
                    }

                    return <UnoHand key={ p.socketId }
                                    socketId={ p.socketId }
                                    self={ p.socketId === socket.id ? true : false }
                                    top={ p.position === 0 || p.position === 2 ? true : false } 
                                    left={ p.position === 0 || p.position === 3 ? true : false }
                                    cards={ handCards[p.position] }
                                    activeCards={ activeCardsList }/>
                })
            }
            {
                activeCards.map(card => {
                    return card;
                })
            }
            <div id='from' className='marker'></div>
            <div id='to' className='marker'></div>
        </div>
    );
}

export default UnoGameBoard;