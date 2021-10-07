
const TimeView = (props) => {
    const timelst = props.time
    return (
        <div className="home">
            {timelst.map(time => (
                <div className="timewrapper">
                    < div className={time.id === 3 ? "timeline-spe" : "timeline"} key={time.id} >
                        <h2>{time.title}</h2>
                    </div>
                </div>
            ))
            }
        </div >
    );
}

export default TimeView;