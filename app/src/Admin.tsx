import { createRef, Dispatch, FC, SetStateAction, useState } from "react";
import { w3cwebsocket } from "websocket";
import { TimeList } from "./types";

interface AdminProps {
    time: TimeList[],
    setTime: Dispatch<SetStateAction<TimeList[]>>,
    websocket: w3cwebsocket,
    infos: Info[]
}
type Info = {
    text: string,
    setText: Dispatch<SetStateAction<string>>,
    jsonstr: string
}
const Admin: FC<AdminProps> = ({ time, setTime, websocket: client, infos }) => {
    // Binding Vars
    const sTime = createRef<HTMLInputElement>();
    const sDelta = createRef<HTMLSelectElement>();
    //
    const [isPanding, setIsPanding] = useState(false);
    const [btn_dis, setBtnDis] = useState(false);
    //const url = 'http://localhost:4000/timelst/';

    const addTime = () => {
        let array: TimeList[] = [];
        const delta = sDelta.current != null ? parseInt(sDelta.current.value) : 10;
        let hour, min;
        let currentTime = sTime.current != null ? sTime.current.value : "10:00";
        [hour, min] = StringTimeify(currentTime);
        if (min - 2 * delta < 0)
            hour = (24 + hour - 1) % 24
        min = (60 + min - 2 * delta) % 60;
        for (let index = 5; index > 0; index--) {
            array.push({ id: index, title: TimeStringify(hour, min) });
            if (min + delta >= 60)
                hour = (hour + 1) % 24;
            min = (min + delta) % 60;
        }
        array.sort((a, b) => a.id - b.id);
        setTime([...array]);
        client.send(JSON.stringify({ what: "lst", data: array }));
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
    const nextTime = (delta: number) => {
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
        <div className="adminwrapper">
            <div className="admin">
                <label> Uhrzeit eingeben </label>
                <input type="text" placeholder="Uhrzeit" name="sTime" onChange={(e) => {
                    if (sTime.current !== null && sTime.current.value.match(/^([0-1][0-9]|2[0-4]):\d\d$/))
                        setBtnDis(true);
                    else
                        setBtnDis(false);
                }} ref={sTime} /><br />
                <select ref={sDelta}>
                    <option value="5">5 min</option>
                    <option value="10">10 min</option>
                </select>
                {infos.map((info, id) =>
                (
                    <div key={id}>
                        <p>Info {id} :</p>
                        <textarea onChange={(e) => {
                            console.log("test");
                            info.setText(e.target.value);
                            client.send(JSON.stringify({ what: info.jsonstr, data: e.target.value }));
                        }
                        } value={info.text} ></textarea>
                    </div>
                )
                )}
                {!btn_dis && <p>Eine richtige Uhrzeit eingeben</p>}
                <button onClick={addTime} disabled={!btn_dis}>Time</button>

            </div>
            <div className="admintime">
                <p>Termine</p>
                {time.map((t: TimeList) => (
                    t.id <= 3 && (< div className={t.id === 3 ? "timeline-spe" : "timeline"} key={t.id} >
                        <h2>{t.title}</h2>
                    </div>)
                ))}
                {!isPanding && <button onClick={(e) => nextTime(10)}>Next (10)</button>}
                {isPanding && <button >Loading</button>}
                {!isPanding && <button onClick={(e) => { nextTime(5); }}>Next (5)</button>}
                {isPanding && <button >Loading</button>}
            </div>
        </div >
    );
}

export default Admin;
