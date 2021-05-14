import { useState, useContext } from 'react';
import $ from 'jquery';
import { v4 as uuidv4 } from 'uuid';

import './CategorySelection.css';

import { BiAddToQueue } from 'react-icons/bi';
import { IconContext } from "react-icons";

import Category from './Category/Category';
import SocketContext from '../../../services/socket';

function CategorySelection(props) {

    // Socket.io
    const socket = useContext(SocketContext);

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
        
        socket.emit('slf:start-game', { categories: newCategoroies }, (error) => {
            console.log(error);
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
                                    clickDelete = { deleteCategory }/>
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