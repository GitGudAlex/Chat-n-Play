import { useState, useEffect } from 'react';
import './GameBoard.css';

function GameBoard(props) {

    const [categories, setCategories] = useState([]);
    const [rounds, setRounds] = useState();
    const [cells, setCells] = useState([]);

    useEffect(() => {
        setCategories(props.categories);
        setRounds(props.rounds);

        let result = [];

        for(let i = 0; i < props.rounds; i++) {
            result.push(<tr> <td/> { props.categories.map((c, index) => <td key={ i + '-' + index } />) } <td/> </tr>)
        }

        setCells(result);

    }, [props]);

    if(categories === undefined || rounds === undefined) {
        return (
            <div>asdasd</div>
        );
    } else {
        return (
            <div id='slf-game-board'>
                <table id='slf-game-table'>
                    <thead>
                        <tr>
                            <th/>

                            {
                                categories.map((entry, index) => (
                                    <th key={ index + '-header' } >{ entry.category }</th>
                                ))
                            }

                            <th id='game-table-points'>P</th>
                        </tr>
                    </thead>
                    <tbody>
                        { cells }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default GameBoard;