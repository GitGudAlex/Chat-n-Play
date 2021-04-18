import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SocketContext, { socket } from "../../services/socket";

import Home from '../Home/Home';
import Invitation from '../Invitation/Invitation';
import Game from '../Game/Game';
import PageNotFound from '../PageNotFound/PageNotFound';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Switch>
          <Route path='/' exact component={ Home } />
          <Route path='/invitation/:roomid' exact component={ Invitation } />
          <Route path='/game/:roomid' component={ Game } />
          <Route component={ PageNotFound } />
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
