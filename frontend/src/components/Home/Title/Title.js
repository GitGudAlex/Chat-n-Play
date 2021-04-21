import './Title.css';

function Title(props) {
    return (
        <div style={{ height: props.height }} id='titleWrapper' className='sticky-top d-flex align-items-center justify-content-center'>
            <h1 style={{ fontSize: props.fontSize }} id='title'>{ props.text }</h1>
        </div>
    );
}

export default Title;