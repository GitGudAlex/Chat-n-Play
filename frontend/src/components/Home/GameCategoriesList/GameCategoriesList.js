import { useState, useEffect } from 'react';

import './GameCategoriesList.css'

import GameCategory from './GameCategory/GameCategory';

function GameCategoriesList() {
    useEffect(() => {
        fetchGameCategories();
    }, []);

    const [gameCategories, setGameCategories] = useState([]);

    const fetchGameCategories = async() => {
        const data = await fetch("/games/gamecategories");
        const gameCategories = await data.json();

        setGameCategories(gameCategories);
    };

    return (
        <div id='accordion' className='game-category-list'>
            { 
                gameCategories.map(gameCategory => (
                    <GameCategory key={ gameCategory.gameCategoryId } gameCategoryId={ gameCategory.gameCategoryId } categoryName={ gameCategory.gameCategoryName } color={ gameCategory.color} />
                ))
            }
        </div>
    );
}

export default GameCategoriesList;