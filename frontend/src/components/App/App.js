import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SocketContext, { socket } from "../../services/socket";

import Home from '../Home/Home';
import Lobby from '../Lobby/Lobby';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Switch>
          <Route path='/' exact component={ Home } />
          <Route path='/lobby' component={ Lobby } />
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
