import './Players.css'; 
import $ from 'jquery';

import Player from './Player/Player';
import { useLayoutEffect } from 'react';

function Players(props) {

    // Positionen der Spieler
    const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'];

    useLayoutEffect(() => {
         // Wenn die Fenstergröße geändert wird -> Größe anpassen
         window.addEventListener('resize', () => {
            $('.player').height($('.player').width()/16 * 9);
        });
    }, []);

    return (
        <div className='players'>
            {
                props.players.map(player => (
                    <Player key = { player.username  } 
                        username = { player.username }
                        color = { player.color }
                        position = { positions[player.position] }
                        score = { props.scores.length === 0 ? undefined : props.scores.find(score => score.username === player.username).score } 
                        ludo = {props.ludo === undefined ? undefined : props.ludo}
                        width = { props.width }/>
                ))
            }
        </div>
    );
}

export default Players;