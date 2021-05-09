import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SocketContext, { socket } from "../../services/socket";

import Home from '../Home/Home';
import Invitation from '../Invitation/Invitation';
import Lobby from '../Lobby/Lobby';
import PageNotFound from '../PageNotFound/PageNotFound';
import Ludo from '../Ludo/Ludo';
import Slf from '../Slf/Slf';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Switch>
          <Route path='/' exact component={ Home } />
          <Route path='/invitation/:roomid' exact component={ Invitation } />
          <Route path='/lobby/:roomid' component={ Lobby } />
          <Route path='/ludo/:roomid' component={ Ludo }/>
          <Route path='/slf/:roomid' component={ Slf }/>
          <Route component={ PageNotFound } />
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
