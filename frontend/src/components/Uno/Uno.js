import UnoGameBoard from './UnoGameBoard/UnoGameBoard';

function Uno(props) {
    return (
        <div>
            <div id='game-content'>
                <UnoGameBoard isHost={ props.isHost } />
            </div>
        </div>
    );
}

export default Uno;