import './CategoryInput.css';

function CategoryInput(props) {

    let flexStyleValue;

    if(props.length >= 6) {
        flexStyleValue = { flex: '0 0 50%' };

    } else {
        flexStyleValue = { flex: '0 0 100%' };
    }

    return (
        <div className='slf-category-input-wrapper' style={ flexStyleValue }>
            <div className='slf-category-input'>
                <label className='slf-category-lable' htmlFor={ 'category-input-' + props.category } >{ props.category }</label>
                <input type='text'
                    placeholder=''
                    name={ 'category-' + props.category }
                    id={ 'category-input-' + props.category }
                    className='slf-category-input-guess'
                    maxLength={ 128 } 
                    onChange={ (event) => props.onChangeHandler(event, props.id) }
                    disabled={ props.disabled }/>
            </div>
        </div>
    );
}

export default CategoryInput;