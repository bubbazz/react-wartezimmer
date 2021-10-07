const Time = (props: any) => {
    var time: Date = props.realtime;
    return (
        <div className="time">
            <h1>{time.getHours() + ":" + time.getMinutes() + "." + time.getSeconds()}</h1>
        </div>
    );
}

export default Time;