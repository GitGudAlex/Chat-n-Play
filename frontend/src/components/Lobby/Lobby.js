import { useContext, useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import './Lobby.css'

import SideBar from '../SideBar/SideBar';
import Title from '../Home/Title/Title';
import SocketContext from '../../services/socket';

function Lobby() {
    // Game Data (roomid, gameid, players, ...)
    const [gameId, setGameId] = useState();
    const [roomId, setRoomId] = useState();
    const [hostId, setHostId] = useState();
    const [players, setPlayers] = useState();

    // Router Stuff
    const history = useHistory();
    const location = useLocation();

    // Socket.io
    const socket = useContext(SocketContext);

    /*
    useEffect(() => {
        // Schauen, ob man sich überhaupt in einem Raum befindet 
        socket.emit('room:is-in-room', (isInRoom) => {
            if(!isInRoom) {
                history.push('/');

            // Wenn sich der Socket in einem Raum befindet (wurde durch das joinen eines Raums auf die Seite gebracht
            } else {
                let gameData = location.state.data;

                setGameId(gameData.gameTypeId);
                setRoomId(gameData.roomId);
                setHostId(gameData.hostId);
                setPlayers(gameData.players);
            }
        });
        
    }, [socket, history, location.state]); */

    return (
        <div className='lobby-wrapper p-0'>
            <header className="lobby-header">
                <Title text="Chat N' Play" height="10vh" fontSize="4em"/>
            </header>
            <main className='lobby-body'>
                <div className="container-fluid p-0">
                    <div className='row lobby-body-wrapper m-0'>
                        <div className='sidebar-wrapper p-0'>
                            <SideBar position='left' contentId='#lobby-content' sideBarWidth={ 40 } sideBarWindowWidth={ 350 }/>
                        </div>
                        <div id='lobby-content' className='col p-0'>
                            sfpojkdsapfjepoafdkjpewoqjfpjwefjEW
                            FWEjfjoipwjefiopwejfpjwefjwefewjfküo0wefio8ewjorfuoeiuw hfiuopWFHIUPEWHRFHEWUOI FIUEWHfuiohwefhjweü9fhEWOÜUHFOUEWjhfouiüewjhfoüuiewhfoiuüewhfoüiwehfoiewh 
                            wFHWEFJWEOÜUIFHJEWOUIÜHFOUW hf0oiuewjhf08üoh 9iuhweoiuAWHOIUFHRHWI HFIOUSAFPISgaruzweg  f9uwegr9tuwfg9uifojwrfgpüwhrf9oiu
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );


    // Nur anzeigen, wenn man wirklich in einem Raum ist
    /*if(gameId === undefined) {
        return <div></div>;

    } else {

        return (
            <div>
                <SideBar position='left' gameId={ gameId } />
            </div>
        );
    }*/
}

export default Lobby;