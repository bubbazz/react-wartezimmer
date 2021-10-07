//import logo from './logo.svg';
import TimeView from './TimeView';
import Admin from './Admin';
import NavigationsBar from "./Navbar";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TimeList } from './types';

import { w3cwebsocket } from 'websocket';
import Time from './Time';

const client = new w3cwebsocket('ws://localhost:4001');

function App() {
  // mook data is in ./data/db.json
  const [stateTimeLst, setstateTimeLst] = useState<TimeList[]>([{ id: 0, title: "FEHLER" }]);
  const [realtime, setRealtime] = useState<Date>(new Date);
  useEffect(() => {
    client.onopen = () => {

    };
    client.onmessage = (message) => {
      var json = JSON.parse(message.data.toString());
      if (json.what === "lst")
        setstateTimeLst(json.data);
      else if (json.what === "time") {
        setRealtime(new Date(json.data));
      }
    };
    client.onerror = (error) => {
      console.log(error);
    }
  }, []); // just once loading no dep []

  return (
    <Router>
      <div className="app">
        <NavigationsBar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Time realtime={realtime} />
              <div className="info">info</div>
              {stateTimeLst && <TimeView timelst={stateTimeLst} />}
            </Route>
            <Route path="/admin">
              <Admin time={stateTimeLst} setTime={setstateTimeLst} websocket={client} />
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
