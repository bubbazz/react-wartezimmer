import { createRef, useState } from "react";
import { PropsTimeList, TimeList } from "./types";
const Admin = (props: PropsTimeList) => {
    const time = props.time;
    const setTime = props.setTime;
    // Binding Vars
    const sTime = createRef<HTMLInputElement>();
    const sDelta = createRef<HTMLInputElement>();
    //
    const [isPanding, setIsPanding] = useState(false);
    const url = 'http://localhost:4000/timelst/';

    const addTime = () => {
        let array = [];
        const delta = sDelta.current != null ? parseInt(sDelta.current.value) : 10;
        let hour, min;
        let currentTime = sTime.current != null ? sTime.current.value : "10:00";
        [hour, min] = StringTimeify(currentTime);
        if (min - delta < 0)
            hour = (hour - 1) % 24
        min = (min - delta) % 60;
        //stime = stime.substring(0, 3) + (parseInt(stime.substring(3)))
    };
    const StringTimeify = (str: string) => {
        let hour = parseInt(str.substring(0, 2));
        let min = parseInt(str.substring(3));
        return [hour, min];
    }
    const TimeStringify = (hour: number, min: number) => {
        let sRet = "";
        if (hour < 10)
            sRet += "0" + hour + ":";
        if (min < 10)
            sRet = "0" + min;
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
        for (let i = 1; i < time.length + 1; i++)
            fetch(url + i, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: array[i - 1] })
            }).then(() => setIsPanding(false))
        //React Time Update not needed for 2 Clients 
        for (let i = 0; i < time.length - 1; i++)
            time[i].title = array[i];
        console.log(array)
        setTime([...time]);
    }

    return (
        <div className="admin">
            <input type="text" placeholder="Uhrzeit" value="10:00" name="sTime" ref={sTime} /><br />
            <input type="number" placeholder="Delta" value="10" name="sDelta" ref={sDelta} /><br />
            <p>REST</p>
            {!isPanding && <button onClick={nextTime}>Next</button>}
            {isPanding && <button onClick={nextTime}>Loading</button>}
        </div >
    );
}

export default Admin;
