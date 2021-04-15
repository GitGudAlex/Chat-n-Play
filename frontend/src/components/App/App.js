import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from '../Home/Home';
import Lobby from '../Lobby/Lobby';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={ Home } />
        <Route path='/lobby' component={ Lobby } />
      </Switch>
    </Router>
  );
}

export default App;
