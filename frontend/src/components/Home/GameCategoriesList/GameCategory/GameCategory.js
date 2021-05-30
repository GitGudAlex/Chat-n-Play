import { useState, useEffect } from 'react';
import $ from 'jquery';

import './GameCategory.css'

import Game from './Game/Game';

function GameCategory(props) {
    const [games, setGames] = useState([]);

    const [gameCategoryId, setGameCategoryId] = useState();
    const [categoryName, setCategoryName] = useState();
    const [color, setColor] = useState();
    
    useEffect(() => {
        const fetchGamesByCategory = async() => {
            const data = await fetch("/games/category?gameCategoryId=" + props.gameCategoryId);
            const games = await data.json();
    
            setGames(games);
        };

        fetchGamesByCategory();

    }, [props.gameCategoryId]);

    useEffect(() => {
        setGameCategoryId(props.gameCategoryId);
        setColor(props.color);
        setCategoryName(props.categoryName);
        console.log(props);
    }, [props]);

    if(color === undefined || categoryName === undefined || gameCategoryId === undefined) {
        return (
            <div style={{ height: '100%' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    <div className="spinner-border" style={{ width: '4rem', height: '4rem' }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            { 
                games.map(game => (
                    <Game key={ game.id } gameId={ game.id } name={ game.name } description={ game.description} />
                ))
            }
        </div>
    );
}

export default GameCategory;