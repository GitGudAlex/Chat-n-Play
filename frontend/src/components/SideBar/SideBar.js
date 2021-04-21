import { useEffect } from 'react';
import $ from 'jquery';

import { BsFillChatDotsFill } from 'react-icons/bs';
import { ImBook } from 'react-icons/im';
import { BsBoxArrowLeft } from 'react-icons/bs';

import './SideBar.css';

import Chat from './Chat/Chat';
import Rules from './Rules/Rules';

function SideBar(props) {

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


  return (
    <div className='sidebar' style={{ width: props.sideBarWidth + 'px'}}>
      <div className='sidebar-bar-wrapper'>
        <button className="sidebar-btn" onClick={ () => toggleSideBar("#sidebar-chat") }>
          <BsFillChatDotsFill size={ 28 } />
        </button>
        <button className="sidebar-btn" onClick={ () => toggleSideBar("#sidebar-rules") }>
          <ImBook size={ 28 } />
        </button>
        <button className="sidebar-btn">
          <BsBoxArrowLeft size={ 28} />
        </button>
      </div>
      <div id="sidebar-chat" className='sidebar-window'>
        <Chat closeFunction={ toggleSideBar }/>
      </div>
      <div id="sidebar-rules" className='sidebar-window'>
        <Rules closeFunction={ toggleSideBar }/>
      </div>
    </div>
  );
}

export default SideBar;
