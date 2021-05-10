import $ from 'jquery';

import './PlayerCorner.css';

function PlayerCorner(props) {

    const parentElementWidth = $(".players").width();
    console.log(parentElementWidth);
    const width = props.width === undefined ? 24 : props.width;

    const playerStyle = {
        width: width + '%',
        height: (parentElementWidth / 100 * width) / 16 * 9
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

export default PlayerCorner;