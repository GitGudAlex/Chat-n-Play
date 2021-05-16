import $ from 'jquery';
import { useLayoutEffect, useState } from 'react';
import House from '../../Ludo/house/house';

import './Player.css';

function Player(props) {

    const [parentElementWidth, setParentElementWidth] = useState();

    const x_res = 16;
    const y_res = 9;

    useLayoutEffect(() => {
        setParentElementWidth($(".players").width());
    }, []);

    // Falls div Struktur falsch aufgebaut ist
    if(parentElementWidth === undefined) {
        return (
            <div></div>
        );
    }

    const width = props.width === undefined ? 24 : props.width;
    const playerStyle = {
        width: width + '%',
        height: (parentElementWidth / 100 * width) / x_res * y_res,
        minWidth: '200px',
        minHeight: (200 / x_res * y_res) + 'px'
    };

    if(props.color === undefined) {
        return (
            <div className={ props.position + ' player'} style={ playerStyle }>
                <div style={{ border: '3px solid #474747' }} className='camera'>

                </div>
                <div className='player-name'>
                    <p>{ props.username }</p>
                </div>
            </div>
        );
    } else if(props.ludo === "Ludo") {
        return (
            <div className={ props.position + ' player'} style={ playerStyle }>
                <div style={{ border: '3px solid ' + props.color }} className='camera'>
    
                </div>
                <div className='player-name'>
                    <p>{ props.username }</p>
                    <House color = {props.color} position = {props.position}/>
                </div>
            </div>
        );
    } else if(props.score === undefined) {
        return (
            <div className={ props.position + ' player'} style={ playerStyle }>
                <div style={{ border: '3px solid ' + props.color }} className='camera'>
    
                </div>
                <div className='player-name'>
                    <p>{ props.username }</p>
                </div>
            </div>
        );
    } else {
        return (
            <div className={ props.position + ' player'} style={ playerStyle }>
                <div style={{ border: '3px solid ' + props.color }} className='camera'>
    
                </div>
                <div className='player-name-score'>
                    <p>{ props.username }</p>
                    <p>{ 'Score: ' + props.score }</p>
                </div>
            </div>
        );
    }
}

export default Player;