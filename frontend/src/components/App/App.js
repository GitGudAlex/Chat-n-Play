import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from 'react-router';
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
          <Route path='/' exact render={ () => <Home /> } />
          <Route path='/invitation/:roomid' exact render={ ({match}) => <Invitation match={ match } /> } />
          <Route path='/game' render={ ({match}) => <GameBase match={ match } /> } />
          <Route render={ () => <PageNotFound /> } />
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
