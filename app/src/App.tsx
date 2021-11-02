import TimeView from './TimeView';
import Admin from './Admin';
import NavigationsBar from "./Navbar";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TimeList } from './types';

import { w3cwebsocket } from 'websocket';
import Time from './Time';
import Info from './Info';

const client = new w3cwebsocket('ws://localhost:4001');

function App() {
  // mook data is in ./data/db.json
  const [stateTimeLst, setstateTimeLst] = useState<TimeList[]>([{ id: 11, title: "FEHLER" }]);
  useState<TimeList>({ id: 11, title: "10:10" })
  const [realtime, setRealtime] = useState<Date>(new Date());
  const [text, setText] = useState<string>("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.");
  useEffect(() => {
    client.onopen = () => {

    };
    client.onmessage = (message) => {
      var json = JSON.parse(message.data.toString());
      switch (json.what) {
        case "lst":
          setstateTimeLst(json.data);
          break;
        case "time":
          setRealtime(new Date(json.data));
          break;
        case "info":
          setText(json.data);
          break;
        default:
          break;
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
              <Info text={text} id="one" />
              <Time realtime={realtime} />
              <Info text={text} id="two" />
              {stateTimeLst && <TimeView timelst={stateTimeLst} />}
            </Route>
            <Route path="/admin">
              <Admin time={stateTimeLst} setTime={setstateTimeLst} websocket={client} text={text} setText={setText} />
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
