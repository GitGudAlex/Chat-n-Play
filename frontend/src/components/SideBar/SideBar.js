import { useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import $ from 'jquery';

import { BsFillChatDotsFill } from 'react-icons/bs';
import { ImBook } from 'react-icons/im';
import { BsBoxArrowLeft } from 'react-icons/bs';

import './SideBar.css';

import Chat from './Chat/Chat';
import Rules from './Rules/Rules';
import SocketContext from '../../services/socket';


function SideBar(props) {

  // Router Stuff
  const history = useHistory();

  // Socket.io
  const socket = useContext(SocketContext);

  function toggleSideBar(sidebarId) {
    // Wenn die Sidebar links plaziert ist
    if(props.position === 'left') {

      // Sidebar öffnen
      if($(sidebarId).css('marginLeft') === (props.sideBarWidth - props.sideBarWindowWidth) + 'px') {
        $('.sidebar-window').not(sidebarId).animate({ 'left': '0', 'margin-left': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' }, { duration: 200, queue: false });
        $(sidebarId).animate({ 'left': '0', 'margin-left': (props.sideBarWidth) + 'px' });

        // content zur Seite pushen
        $(props.contentId).animate({ 'margin-left': props.sideBarWindowWidth + 'px' }, { duration: 200, queue: false });

      // Sidebar schließen
      } else {
        $(sidebarId).animate({ 'left': '0', 'margin-left': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' }, { duration: 200, queue: false });

        // conent wieder richtig stellen
        $(props.contentId).animate({ 'margin-left': '0px' }, { duration: 200, queue: false });

      }

    // Wenn die Sidebar rechts plaziert ist
    } else {
      // Sidebar öffnen
      if($(sidebarId).css('marginRight') === (props.sideBarWidth - props.sideBarWindowWidth) + 'px') {
        $('.sidebar-window').not(sidebarId).animate({ 'right': '0', 'margin-right': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' }, { duration: 200, queue: false });
        $(sidebarId).animate({ 'right': '0', 'margin-right': (props.sideBarWidth) + 'px' });

        // content zur Seite pushen
        $(props.contentId).animate({ 'margin-right': props.sideBarWindowWidth + 'px' }, { duration: 200, queue: false });

      // Sidebar schließen
      } else {
        $(sidebarId).animate({ 'right': '0', 'margin-right': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' }, { duration: 200, queue: false });
        
        // conent wieder richtig stellen
        $(props.contentId).animate({ 'margin-right': '0px' }, { duration: 200, queue: false });
      }
    }

    // Chat Input fokusen, wenn Chat aufgemacht wird
    if(sidebarId === '#sidebar-chat') {
      $('#chat-input').focus();
    }
  }


  useEffect(() => {
    // SideBar Fenster nach Links oder Rechts setzten
    if(props.position === 'left') {
      $('.sidebar-window').css({ 'left': '0', 'margin-left': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' });
      
    } else {
      $('.sidebar-window').css({ 'right': '0', 'margin-right': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' });
  
    }

    // Höhe der SideBars auf richtige Höhe setzten
    $('.sidebar-window').height($('.sidebar-wrapper').height());

    // Sidebar width setzten
    $('.sidebar-window').css('width', props.sideBarWindowWidth + 'px');

  }, [props.position, props.sideBarWidth, props.sideBarWindowWidth]);

  
  // Raum verlassen
  const leaveRoom = () => {

    // Modal wieder schließen
    $('#leaveModal').modal('hide');
    
    // Serverseitig event auslösen um zu löschen und 'aufzuräumen'
    socket.emit('room:leave-room');

    // Zur Startseite weiterleiten
    history.push('/');

  }


  return (
    <div className='sidebar' style={{ width: props.sideBarWidth + 'px'}}>
      <div className='sidebar-bar-wrapper'>
        <button className="sidebar-btn" onClick={ () => toggleSideBar("#sidebar-chat") }>
          <BsFillChatDotsFill size={ 28 } />
        </button>
        <button className="sidebar-btn" onClick={ () => toggleSideBar("#sidebar-rules") }>
          <ImBook size={ 28 } />
        </button>
        <button id='leave-room-btn' className="sidebar-btn" data-toggle="modal" data-target="#leaveModal">
          <BsBoxArrowLeft size={ 28} />
        </button>
      </div>
      <div id="sidebar-chat" className='sidebar-window'>
        <Chat closeFunction={ toggleSideBar }/>
      </div>
      <div id="sidebar-rules" className='sidebar-window'>
        <Rules closeFunction={ toggleSideBar } text={ props.rules }/>
      </div>

      <div className="modal fade" id="leaveModal" data-backdrop="true">
        <div className="modal-dialog  modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-body"> 
                  <p id='leave-modal-text'>Willst du den Raum wirklich verlassen?</p>
                  <div id='leave-modal-btns'>
                    <button type="button" className="leave-modal-btn btn btn-primary" data-dismiss="modal">Nein</button>
                    <button type="button" className="leave-modal-btn btn btn-secondary" onClick={ leaveRoom }>Ja</button>
                  </div>
                </div>
            </div>
        </div>
      </div>


    </div>
  );
}

export default SideBar;
