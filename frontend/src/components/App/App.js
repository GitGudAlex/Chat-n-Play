import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SocketContext, { socket } from "../../services/socket";

import './App.css';

import Home from '../Home/Home';
import Invitation from '../Invitation/Invitation';
import GameBase from '../GameBase/GameBase';
import PageNotFound from '../PageNotFound/PageNotFound';

function App() {
  return (
    <SocketContext.Provider value={ socket }>
      <Router>
        <Switch>
          <Route path='/' exact component={ Home } />
          <Route path='/invitation/:roomid' exact component={ Invitation } />
          <Route path='/game' component={ GameBase } />
          <Route component={ PageNotFound } />
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
