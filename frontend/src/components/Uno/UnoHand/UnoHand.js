import { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import $ from 'jquery';

import './UnoHand.css';

import UnoCard from '../UnoCard/UnoCard';

function UnoHand(props) {

    const [cards, setCards] = useState([]);
    const [playerWidth, setPlayerWidth] = useState();

    const resizeHandHandler = useCallback(() => {
        if(props.top) {
            setPlayerWidth($('.player').width());

        }

    }, [props.top]);

    // Width setzten bei Windows resize event
    useLayoutEffect(() => {
        // Wenn die Fenstergröße geändert wird -> Größe anpassen
        window.addEventListener('resize', resizeHandHandler);

        return () => {
            window.removeEventListener('resize', resizeHandHandler);
        }

    }, [resizeHandHandler]);

    // Width setzten am Anfang
    useEffect(() => {
        if(props.top) {
            setPlayerWidth($('.player').width());
        }

    }, [props.top]);

    // Eigene Hand
    if(props.self) {
        return(
            <div className='uno-my-hand-wrapper'>
                <div id={ props.socketId + '-uno-player' } className='uno-my-hand'>
                    {
                        cards.map((card) => {
                            return (
                                <div className='uno-my-card-wrapper' key={ card.id }>
                                    <UnoCard card={ card } />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    let posStyle;

    // Spieler unten
    if(!props.top) {

        // Spieler links
        if(props.left) {
            posStyle = {
                left: '0',
                top: '-120px'
            }

        // Spieler rechts
        } else {
            posStyle = {
                right: '0',
                top: '-120px'
            }
        }

        return (
            <div id={ props.socketId + '-uno-player' } className='uno-other-hand' style={ posStyle }>
                {
                    cards.map((card) => {
                        return (
                            <div className='uno-other-card-wrapper' key={ card.id }>
                                <UnoCard card={ card } />
                            </div>
                        )
                    })
                }
                <img id={ 'uno-deck-ref-' + props.socketId } className='uno-card-small invisible' src={ '/UnoCardsImages/-1.png' } alt='Referenz Bild' />
            </div>
        );
    }

    // Spieler links
    if(props.left) {
        posStyle = {
            left: playerWidth + 20 + 'px'
        }

    // Spieler rechts
    } else {
        posStyle = {
            right: playerWidth + 20 + 'px'
        }
    }

    return (
        <div id={ props.socketId + '-uno-player' } className='uno-other-hand' style={ posStyle }>
            {
                cards.map((card) => {
                    return (
                        <div className='uno-other-card-wrapper' key={ card.id }>
                            <UnoCard card={ card } />
                        </div>
                    )
                })
            }
            <img id={ 'uno-deck-ref-' + props.socketId } className='uno-card-small invisible' src={ '/UnoCardsImages/-1.png' } alt='Referenz Bild' />
        </div>
    );
}

export default UnoHand;