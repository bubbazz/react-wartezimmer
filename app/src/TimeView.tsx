import { FC } from "react";
import { TimeList } from "./types";

interface TimeViewProps {
    timelst: TimeList[]
}
const TimeView: FC<TimeViewProps> = ({ timelst }) => {
    return (
        <div className="home">
            {timelst.map((time: TimeList) => (
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