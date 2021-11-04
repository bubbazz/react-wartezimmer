import TimeView from './TimeView';
import Admin from './Admin';
import NavigationsBar from "./Navbar";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TimeList } from './types';

import { w3cwebsocket } from 'websocket';
import Info from './Info';
import CalleeInfo from './CalleeInfo';

const client = new w3cwebsocket('ws://localhost:4000');

function App() {
  // mook data is in ./data/db.json
  const [stateTimeLst, setstateTimeLst] = useState<TimeList[]>([{ id: 11, title: "FEHLER" }]);
  const [stateCallee, setStateCallee] = useState<TimeList>({ id: 11, title: "10:10" })
  //const [realtime, setRealtime] = useState<Date>(new Date());
  const [info1, setInfo1] = useState<string>("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam  est Lorem ipsum dolor sit amet.");
  const [info2, setInfo2] = useState<string>("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam  est Lorem ipsum dolor sit amet.");
  var infos = [{ text: info1, setText: setInfo1, jsonstr: "infotop" }, { text: info2, setText: setInfo2, jsonstr: "infobot" }];
  useEffect(() => {
    client.onopen = () => {

    };
    client.onmessage = (message) => {
      var json = JSON.parse(message.data.toString());
      switch (json.what) {
        case "lst":
          setstateTimeLst(json.data);
          break;
        /*case "time":
          setRealtime(new Date(json.data));
          break;
          */
        case "infotop":
          setInfo1(json.data);
          break;
        case "infobot":
          setInfo2(json.data);
          break;
        default:
          break;
      }
    };
    client.onerror = (error) => {
      console.log(error);
    }
  }, []); // just once loading no dep []
  useEffect(() => {
    if (stateTimeLst.length >= 3 && stateTimeLst[2] != null)
      setStateCallee(stateTimeLst[2]);
  }, [stateTimeLst])
  return (
    <Router>
      <div className="app">
        <NavigationsBar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Info text={info1} id="one" />
              <CalleeInfo calleeTime={stateCallee} />
              <Info text={info2} id="two" />
              {stateTimeLst && <TimeView timelst={stateTimeLst} />}
            </Route>
            <Route path="/admin">
              <Admin time={stateTimeLst} setTime={setstateTimeLst} websocket={client} infos={infos} />
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
