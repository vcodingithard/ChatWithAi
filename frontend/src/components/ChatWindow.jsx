import React from 'react';
import "../Styling/ChatWindow.css"
function ChatWindow() {
    return ( 
        <div className='chatwindow'>
            <div className="navbar">
                    <button><p style={{marginRight:"1rem",fontSize:"large"}}>Dogpt &nbsp;<i className="fa fa-arrow-down" style={{fontSize:"small",opacity:"0.7"}}></i></p></button>
                    <i style={{marginRight:"1rem"}} class="fa fa-user"></i>
            </div> 
            <div className="input">
                <form>
                    <input type="text" placeholder='Ask anything' />
                    <button style={{fontSize:"larger"}}><i className="fa fa-paper-plane"></i></button>
                </form>
            </div>
            <footer>
                <p>Doggpt can make mistakes and is not 100% percent right</p>
            </footer>
        </div>
     );
}

export default ChatWindow;