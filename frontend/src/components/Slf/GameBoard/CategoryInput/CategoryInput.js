import './CategoryInput.css';

function CategoryInput(props) {

    return (
        <div className='slf-game-category-input'>
            <label htmlFor={ 'category-input-' + props.category }>{ props.category }</label>
            <input type='text'
                placeholder=''
                name={ 'category-' + props.category }
                id={ 'category-input-' + props.category }
                className='slf-category-input-guess'
                maxLength={ 128 }/>
        </div>
    );
}

export default CategoryInput;