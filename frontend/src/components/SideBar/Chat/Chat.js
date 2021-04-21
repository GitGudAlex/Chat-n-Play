import { IoMdClose } from 'react-icons/io';
import { IconContext } from "react-icons";

import './Chat.css'

function Chat(props) {
  return (
    <div id='chat-wrapper'>
      <div id='sidebar-chat-heading-wrapper'>
        <h4 id='sidebar-chat-heading'>Chat</h4>
        <button className='close-rules-btn' onClick={ () => props.closeFunction('#sidebar-chat') }>
          <IconContext.Provider value={{ size: '24px', className: 'close-rules-btn-icon' }}>
            <IoMdClose />
          </IconContext.Provider>
        </button>
      </div>
      <div id='chat'>
        <div id='chat-text'>
          
        </div>
        <div id='chat-input-wrapper'>
          <input id='chat-input' type="text" placeholder="Tippe deine Nachricht..."/>
        </div>
      </div>
    </div>
  );
}

export default Chat;
