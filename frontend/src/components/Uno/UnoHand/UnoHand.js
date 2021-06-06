import { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import $ from 'jquery';

import './UnoHand.css';

import UnoCard from '../UnoCard/UnoCard';

function UnoHand(props) {

    // Breite und Höhe der Spieler Kamera
    const [playerWidth, setPlayerWidth] = useState();
    const [playerHeight, setPlayerHeight] = useState()

    const resizeHandHandler = useCallback(() => {
        if(props.self) {
            setPlayerWidth($('.player').width());

        } else {
            // Spieler der sich oben befindet
            if(props.top) {
                setPlayerWidth($('.player').width());

            // Spieler der sich unten befindet
            } else {
                setPlayerHeight($('.player').height());
            }
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

        if(props.self) {
            setPlayerWidth($('.player').width());

        } else {
            // Spieler der sich oben befindet
            if(props.top) {
                setPlayerWidth($('.player').width());

            // Spieler der sich unten befindet
            } else {
                setPlayerHeight($('.player').height());
            }
        }

    }, [props.top, props.self]);

    // Styling setzten
    let posStyle;

    // Eigene Hand
    if(props.self) {

        // Card height
        let cardHeight = $('.uno-card').height();

        posStyle = {
            left: playerWidth + 80 + 'px',
            right: playerWidth + 80 + 'px',
            height: cardHeight + 'px'
        }

        return(
            <div id='uno-own-hand' className='uno-my-hand-wrapper' style={ posStyle }>
                <div id={ props.socketId + '-uno-player' } className='uno-my-hand'>
                    {
                        props.cards.map((card) => {
                            return (
                                <div className='uno-my-card-wrapper' key={ card.id }>
                                    <UnoCard card={ card } />
                                </div>
                            )
                        })
                    }
                    {
                        props.activeCards.map((card) => {
                            return(
                                <div key={ card.props.card.id } id={ 'uno-deck-ref-scaling-' + card.props.card.id } className='uno-my-card-wrapper uno-card-ref-wrapper'>
                                    <img id={ 'uno-deck-ref-' + card.props.card.id } className='uno-card invisible' src={ '/UnoCardsImages/-1.png' } alt='' />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    if(props.top) {

        // oben + links
        if(props.left) {
            posStyle = {
                top: '40px',
                left: playerWidth + 80 + 'px',
                flexDirection: 'row'
            }

        // oben + rechts
        } else {
            posStyle = {
                top: '40px',
                right: playerWidth + 80 + 'px',
                flexDirection: 'row-reverse'
            }

        }
    } else {
        // unten + links
        if(props.left) {
            posStyle = {
                bottom: playerHeight + 80 + 'px',
                left: '40px',
                flexDirection: 'row'
            }

        // unten + rechts
        } else {
            posStyle = {
                bottom: playerHeight + 80 + 'px',
                right: '40px',
                flexDirection: 'row-reverse'
            }

        }
    }


    return (
        <div id={ props.socketId + '-uno-player' } className='uno-other-hand' style={ posStyle }>
            {
                props.cards.map((card) => {
                    return (
                        <div className='uno-other-card-wrapper' key={ card.id }>
                            <UnoCard card={ card } />
                        </div>
                    )
                })
            }
            {
                props.activeCards.map((card) => {
                    return (
                        <div key={ card.props.card.id } id={ 'uno-deck-ref-scaling-' + card.props.card.id } className='uno-other-card-wrapper uno-card-ref-wrapper'>
                            <img id={ 'uno-deck-ref-' + card.props.card.id } className='uno-card-small invisible' src={ '/UnoCardsImages/-1.png' } alt='' />
                        </div>
                    )
                })
            }
        </div>
    );
}

export default UnoHand;