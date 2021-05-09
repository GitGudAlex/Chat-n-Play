import { useState, useEffect } from 'react';
import $ from 'jquery';

import './GameCategory.css'

import Game from './Game/Game';

function GameCategory(props) {
    const [games, setGames] = useState([]);

    
    useEffect(() => {
        const fetchGamesByCategory = async() => {
            const data = await fetch("/games/category?gameCategoryId=" + props.gameCategoryId);
            const games = await data.json();
    
            setGames(games);
        };

        fetchGamesByCategory();

    }, [props.gameCategoryId]);


    const style = {
        backgroundColor: props.color
    }

     // Zur Auswahl scrollen wenn nicht im Bild
     $('#' + props.categoryName + '-collapse').on('shown.bs.collapse', () => {
        let elementTop = $('#' + props.categoryName + '-collapse').offset().top;
        let elementBottom = $('#' + props.categoryName + '-collapse').height() + elementTop;

        let viewportTop = $(window).scrollTop();
        let viewportBottom = viewportTop + $(window).height();

        if(elementBottom > viewportBottom) {
            let element = document.getElementById('game-category-header-' + props.categoryName);
            let headerOffset = 150;
            let bodyRect = document.body.getBoundingClientRect().top;
            let elementRect = element.getBoundingClientRect().top;
            let elementPosition = elementRect - bodyRect;
            let offsetPosition = elementPosition - headerOffset;

            $('html, body').animate({scrollTop : offsetPosition}, 200);
        }
    })

    return (
        <div style={ style }>
            <div id={ 'game-category-header-' + props.categoryName } className='game-category-card d-flex align-items-center justify-content-center' data-toggle='collapse' href={ '#' + props.categoryName + '-collapse' } aria-expanded='false'>
                <h3 className='game-category-card-heading'>{ props.categoryName }</h3>
            </div>
            <div id={ props.categoryName + '-collapse' } className='collapse' data-parent='#accordion'>
                <div className='card-body'>
                    { 
                        games.map(game => (
                            <Game key={ game.id } gameId={ game.id } name={ game.name } description={ game.description} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default GameCategory;