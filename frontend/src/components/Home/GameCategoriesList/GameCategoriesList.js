import { useState, useCallback, useEffect, useContext } from 'react';
import $ from 'jquery';

import './GameCategoriesList.css'

import SocketContext from '../../../services/socket';
import GameCategory from './GameCategory/GameCategory';

function GameCategoriesList() {

    // Socket.io
    const socket = useContext(SocketContext);

    const [activeCategory, setActiveCategory] = useState(0);

    //Events:
    // Wenn ein Raum erstellt wurde -> erstelltem Raum joinen
    const handleRoomCreated = useCallback((data) => {
        // Usernamen bekommen
        let username = $('#create-game-username-input-' + data.gameId).val();

        socket.emit('room:join', { roomId: data.roomId, username }, (error) => {
            if(error) {
                $('#create-game-error-output-' + data.gameId).text(error);

            }
        });

    }, [socket]);

    useEffect(() => {
        fetchGameCategories();

        // Wenn ein Raum erstellt wurde
        socket.on("room:created", handleRoomCreated);
        
    }, [socket, handleRoomCreated]);


    // Spielekategorien vom Server holen
    const [gameCategories, setGameCategories] = useState([]);

    const fetchGameCategories = async() => {
        const data = await fetch("/api/gamecategories");
        const gameCategories = await data.json();

        setGameCategories(gameCategories);
    };


    // Events unmounten
    useEffect(() => {    
        return () => {
            socket.off('room:created', handleRoomCreated);
        }
    }, [socket, handleRoomCreated])
    
    const setGameCategory = (gameCategory) => {
        setActiveCategory(gameCategory);
    }


    return (
        <div>
            <div className='game-categories-navbar'>
                { 
                    gameCategories.map(gameCategory => {
                        if(activeCategory === 0 && gameCategory.gameCategoryId === 0) {
                            setActiveCategory(gameCategory);
                        }

                        return <input key = { gameCategory.gameCategoryId }
                                    className='game-category-nav-item'
                                    type='button'
                                    style={{ textDecorationColor: (gameCategory.gameCategoryId === activeCategory.gameCategoryId ? gameCategory.color : 'black') }}
                                    value={ gameCategory.gameCategoryName }
                                    onClick={ () => setGameCategory(gameCategory ) }/>
                    })
                }
            </div>
            <div>
                <GameCategory gameCategoryId = { activeCategory.gameCategoryId } 
                    color = { activeCategory.color } 
                    categoryName = { activeCategory.gameCategoryName }
                    img = { activeCategory.img }
                    imgbg1 = { activeCategory.imgbg1 }
                    imgbg2 = {activeCategory.imgbg2}/>
            </div>
        </div>
    );
}

export default GameCategoriesList;