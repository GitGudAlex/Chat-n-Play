import { useState, useCallback, useEffect, useContext } from 'react';
import $ from 'jquery';

import './GameCategoriesList.css'

import SocketContext from '../../../services/socket';
import GameCategory from './GameCategory/GameCategory';

function GameCategoriesList() {

    // Socket.io
    const socket = useContext(SocketContext);

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
        const data = await fetch("/games/gamecategories");
        const gameCategories = await data.json();

        setGameCategories(gameCategories);
    };

    return (
        <div id='accordion' className='game-category-list'>
            { 
                gameCategories.map(gameCategory => (
                    <GameCategory key = { gameCategory.gameCategoryId }
                        gameCategoryId = { gameCategory.gameCategoryId }
                        categoryName = { gameCategory.gameCategoryName }
                        color = { gameCategory.color } />
                ))
            }
        </div>
    );
}

export default GameCategoriesList;