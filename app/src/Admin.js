import { useRef, useState } from "react";
const Admin = ({ time, setTime }) => {
    // Binding Vars
    const sTime = useRef();
    const sDelta = useRef();
    //
    const [isPanding, setIsPanding] = useState(false);
    const url = 'http://localhost:4000/timelst/';

    const addTime = () => {
        let array = [];
        const delta = parseInt(sDelta.current.value);
        let hour, min;
        [hour, min] = StringTimeify(sTime.current.value);
        if (min - delta < 0)
            hour = (hour - 1) % 24
        min = (min - delta) % 60;
        stime = stime.substring(0, 3) + (parseInt(stime.substring(3)))
    };
    const StringTimeify = (str) => {
        let hour = parseInt(str.substring(0, 2));
        let min = parseInt(str.substring(3));
        return [hour, min];
    }
    const TimeStringify = (hour, min) => {
        if (min < 10)
            min = "0" + min;
        if (hour < 10)
            hour = "0" + hour;
        return hour + ":" + min;
    }
    const nextTime = () => {
        const delta = parseInt(sDelta.current.value);
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
    // not
    const addTimeREST = (e) => {
        e.preventDefault();
        const data = [{ title: sTime.current.value },
        { title: sTime.current.value }];
        fetch('http://localhost:4000/timelst/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            console.log('new Time added');
        })
    }
    return (
        <div className="admin">
            <input type="text" placeholder="Uhrzeit" ref={sTime} /><br />
            <input type="number" placeholder="Delta" ref={sDelta} /><br />
            <p>REST</p>
            {!isPanding && <button onClick={nextTime}>Next</button>}
            {isPanding && <button onClick={nextTime}>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</button>}
            <button disabled onClick={addTimeREST}>Time</button>
        </div >
    );
}

export default Admin;