import { useState, useContext } from 'react';
import $ from 'jquery';
import { v4 as uuidv4 } from 'uuid';

import './CategorySelection.css';

import { BiAddToQueue } from 'react-icons/bi';
import { IconContext } from "react-icons";

import Category from './Category/Category';
import SocketContext from '../../../services/socket';

import NumericInput from 'react-numeric-input';

function CategorySelection(props) {

    // Socket.io
    const socket = useContext(SocketContext);

    const [num, setNum] = useState(10);

    const [categories, setCategories] = useState(
        [
          { id: uuidv4(), category: 'Stadt' },
          { id: uuidv4(), category: 'Land' },
          { id: uuidv4(), category: 'Fluss' }
        ]
      );

    const addCategory = () => {
        setCategories([...categories, { id: uuidv4(), category: ''} ]);
    }

    const deleteCategory = (index) => {
        let newCategoroies = [...categories];
        newCategoroies.splice(index, 1);

        setCategories(newCategoroies);
    }

    const changeCategoryValue = (index, event) => {
        let newCategoroies = [...categories];
        newCategoroies[index].category = event.target.value;

        setCategories(newCategoroies);
    }

    // ausgesuchte Wörter übergeben
    const submitCategories = () => {
        let newCategoroies = [...categories];
        const rounds = $('#round-selector-input').val();
        
        socket.emit('slf:start-game', { categories: newCategoroies, rounds: rounds }, (error) => {
            $('#slf-start-game-error').text(error);

            setTimeout(() => {
                $('#slf-start-game-error').text('');

            }, 3000)
        });
    }

    let newCategoroies = [...categories];
    let emptyCategories = newCategoroies.filter((entry) => entry.category === '');
    let notEmptyCategories = newCategoroies.filter((entry) => entry.category !== '');

    if(emptyCategories.length > 0 || notEmptyCategories.length < 3 || notEmptyCategories.length > 6) {
        $('#slf-submit-categories-btn').prop('disabled', true);

    } else {
        $('#slf-submit-categories-btn').prop('disabled', false);

    }

    if(props.isHost) {
        return (
            <div className='category-selector-wrapper'>
                <div className='round-selector'>
                    <p className='round-selector-header'>Bitte gib die Anzahl der Runden ein</p>
                    <NumericInput id="round-selector-input" type="number" min="0" max="20" step="1" value={num} onChange={setNum}></NumericInput>
                </div>
                <div className='category-selector'>
                    <p className='category-selector-header'>Bitte wähle 3-6 Kategorien aus</p>
                    <div className='categories-wrapper'>
                        {
                            categories.map((category, index) => (
                                <Category key = { category.id }
                                    id= { category.id }
                                    index = { index }
                                    categoryValue = { category.category }
                                    changeValue={ changeCategoryValue }
                                    clickDelete = { deleteCategory }
                                    focus={ category.category === '' && index + 1 === categories.length ? true : false }/>
                            ))
                        }
                        {
                            categories.length < 6 ? (
                                <div id='add-category'>
                                    <button id='add-category-btn' className='btn btn-primary' onClick={ addCategory }>
                                        <IconContext.Provider value={{ size: '24px' }}>
                                            <BiAddToQueue />
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            ):(
                                <div></div>
                            )
                        }
                    </div>
                </div>
                <div className='slf-start-game'>
                    <input id='slf-submit-categories-btn' className='btn-lg btn-primary' type='button' value='Fertig' onClick={ submitCategories } />
                    <small id='slf-start-game-error' className='text-danger'></small>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <p>Der Host ist dabei die Kategorien für das Spiel auszusuchen.</p>
            </div>
        );
    }
}

export default CategorySelection;