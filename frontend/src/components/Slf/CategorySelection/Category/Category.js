import './Category.css';

import { RiDeleteBack2Fill } from 'react-icons/ri';
import { IconContext } from "react-icons";

function Category(props) {

    return (
        <div className='selector-category'>
            <div className='input-group mb-3'>
                <input id={ 'category-selector-input-' + props.id } className='selector-category-input form-control'
                    type='text'
                    defaultValue={ props.categoryValue }
                    onChange={ (event) => props.changeValue(props.index, event) }
                    placeholder='Kategorie eingeben...'
                    autoFocus={ props.focus }/>
                <div className='input-group-append'>
                    <button className="btn btn-outline-secondary delete-category-btn" type="button" onClick={ () => props.clickDelete(props.index) }>
                        <IconContext.Provider value={{ size: '20px' }}>
                            <RiDeleteBack2Fill />
                        </IconContext.Provider>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Category;