import { createRef, Dispatch, FC, SetStateAction, useState } from "react";
import { w3cwebsocket } from "websocket";
import { TimeList } from "./types";

interface AdminProps {
    time: TimeList[],
    setTime: Dispatch<SetStateAction<TimeList[]>>,
    websocket: w3cwebsocket,
    text: string,
    setText: Dispatch<SetStateAction<string>>,
}
const Admin: FC<AdminProps> = ({ time, setTime, websocket: client, text, setText }) => {
    // Binding Vars
    const sTime = createRef<HTMLInputElement>();
    const sDelta = createRef<HTMLInputElement>();
    //
    const [isPanding, setIsPanding] = useState(false);
    //const url = 'http://localhost:4000/timelst/';

    const addTime = () => {
        let array: TimeList[] = [];
        const delta = sDelta.current != null ? parseInt(sDelta.current.value) : 10;
        let hour, min;
        let currentTime = sTime.current != null ? sTime.current.value : "10:00";
        [hour, min] = StringTimeify(currentTime);
        if (min - delta < 0)
            hour = (24 + hour - 1) % 24
        min = (60 + min - delta) % 60;
        for (let index = 5; index > 0; index--) {
            array.push({ id: index, title: TimeStringify(hour, min) });
            if (min + delta >= 60)
                hour = (hour + 1) % 24;
            min = (min + delta) % 60;
        }
        array.sort((a, b) => a.id - b.id);
        setTime([...array]);
        client.send(JSON.stringify(array));
    };
    const StringTimeify = (str: string) => {
        let hour = parseInt(str.substring(0, 2));
        let min = parseInt(str.substring(3));
        return [hour, min];
    }
    const TimeStringify = (hour: number, min: number) => {
        let sRet = "";
        sRet += hour < 10 ? "0" + hour : hour;
        sRet += min < 10 ? ":0" + min : ":" + min;
        return sRet;
    }
    const nextTime = () => {
        const delta = sDelta.current != null ? parseInt(sDelta.current.value) : 10;
        let array = [];
        let hour, min;
        [hour, min] = StringTimeify(time[0].title);
        if (min + delta >= 60)
            hour = (hour + 1) % 24;
        min = (min + delta) % 60;
        array.push(TimeStringify(hour, min));
        for (let i = 0; i < time.length - 1; i++)
            array.push(time[i].title);
        setIsPanding(true);
        //React Time Update not needed for 2 Clients 
        for (let i = 0; i < time.length; i++)
            time[i].title = array[i];
        setTime([...time]);
        client.send(JSON.stringify({ what: "lst", data: time }));
        setIsPanding(false);
    }

    return (
        <div className="admin">
            <label> Uhrzeit eingeben </label>
            <input type="text" placeholder="Uhrzeit" name="sTime" ref={sTime} /><br />
            <input type="number" placeholder="Delta" name="sDelta" ref={sDelta} /><br />
            <textarea name="" onChange={(e) => {
                setText(e.target.value);
                client.send(JSON.stringify({ what: "info", data: e.target.value }));
            }
            }>{text}</textarea>
            <p>REST</p>
            {!isPanding && <button onClick={nextTime}>Next</button>}
            {isPanding && <button onClick={nextTime}>Loading</button>}
            {<button onClick={addTime}>Time</button>}
        </div >
    );
}

export default Admin;
