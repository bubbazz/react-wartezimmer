//import logo from './logo.svg';
import TimeView from './TimeView';
import Admin from './Admin';
import NavigationsBar from "./Navbar";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TimeList } from './types';

function App() {
  // mook data is in ./data/db.json
  const [stateTimeLst, setstateTimeLst] = useState<TimeList[]>([]);
  useEffect(() => {
    const myInt = setInterval(() => {
      fetch('http://localhost:4000/timelst')
        .then(resp => resp.json())
        .then(data => setstateTimeLst(data));
    }, 3000);
    return () => clearInterval(myInt);
  }, []); // just once loading no dep []
  return (
    <Router>
      <div className="app">
        <NavigationsBar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <div className="time">Time </div>
              <div className="info">info</div>
              {stateTimeLst && <TimeView time={stateTimeLst} />}
            </Route>
            <Route path="/admin">
              <Admin time={stateTimeLst} setTime={setstateTimeLst} />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
// that we can export into other files 
// like import './App.js';
export default App;
