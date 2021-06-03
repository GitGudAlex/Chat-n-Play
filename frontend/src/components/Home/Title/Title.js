import './Title.css';
import logo from '../../../img/Logo.png'
import '../../../fonts/coffee+teademo-Regular.ttf'

function Title(props) {
    return (
        <div style={{ height: props.height }} id='titleWrapper' className='sticky-top d-flex align-items-center justify-content-center'>
            <img src={logo} alt="Logo" id="logo" width="70px" height="70px"></img>
            <h1 style={{ fontSize: props.fontSize }} id='title'>{ props.text }</h1>
        </div>
    );
}

export default Title;