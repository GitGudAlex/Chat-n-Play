import { useState } from 'react';
import UnoCard from '../UnoCard/UnoCard';
import './UnoHand.css';

function UnoHand(props) {

    const [cards, setCards] = useState([]);

    // Eigene Hand
    if(props.self) {

    }

    return (
        <div>
            {
                cards.map((card) => {
                    return <UnoCard card={ card } />
                })
            }
        </div>
    );
}

export default UnoHand;