import { useState, useEffect } from 'react';

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

    return (
        <div style={ style }>
            <div className="game-category-card d-flex align-items-center justify-content-center" data-toggle="collapse" href={ "#" + props.categoryName + '-collapse' } aria-expanded="false">
                <h3 className='game-category-card-heading'>{ props.categoryName }</h3>
            </div>
            <div id={ props.categoryName + '-collapse' } className="collapse" data-parent="#accordion">
                <div className="card-body">
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