import { socket } from "../../services/socket";
import {  useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";



function Footer(props){

    // Router Stuff
    const history = useHistory();

    const handleFooterEvent = useCallback((data) => {

    history.push({
        pathname: data.route,
    });
    
    
    }, [history]);
    
    
    // Socket Events
    useEffect(() => {
    
    socket.on('footer:change', handleFooterEvent);
    
    return () => {
        // Events unmounten
        socket.off('footer:change', handleFooterEvent);
    };
    
    }, [socket, handleFooterEvent]);
    

    const openAboutus = () => {
        socket.emit('footer:aboutus');
    }

    const openFaq = () => {
        socket.emit('footer:faq');
    }

    const openPolicy = () => {
        socket.emit('footer:privacypolicy');
    }

    const openStart = () => {
        socket.emit('footer:start');
    }

    if(props.start === 'true'){
        return(
            <footer className="footer">
                <div className="container" id="container-footer">
                    <input id = "btn-about-us" type='button' value='Über uns' className="text-muted" onClick={ openAboutus } />
                    <input id = "btn-faq" type='button' value='FAQ' className="text-muted" onClick={ openFaq } />
                    <input id = "btn-privacy-policy" type='button' value='Privacy Policy' className="text-muted" onClick={ openPolicy } />
                    <span className="text-muted">E-Mail: chat-n-play@gmail.com</span>
                </div>
            </footer>
        )
    }else{
        return(
            <footer className="footer">
                <div className="container" id="container-footer">
                    <input id = "btn-startpage" type='button' value='Startseite' className="text-muted" onClick={ openStart } /> 
                    <input id = "btn-about-us" type='button' value='Über uns' className="text-muted" onClick={ openAboutus } />
                    <input id = "btn-faq" type='button' value='FAQ' className="text-muted" onClick={ openFaq } />
                    <input id = "btn-privacy-policy" type='button' value='Privacy Policy' className="text-muted" onClick={ openPolicy } />
                    <span className="text-muted">E-Mail: chat-n-play@web.com</span>
                </div>
            </footer>
        )
    }


}

export default Footer;