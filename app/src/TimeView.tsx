import { FC, useEffect, useRef } from "react";
import { TimeList } from "./types";

interface TimeViewProps {
    timelst: TimeList[]
}
const TimeView: FC<TimeViewProps> = ({ timelst }) => {
    const blinkingRef = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        let intervall = 2500;
        let step = 500;
        if (timelst.length === 5) {
            const inter = setInterval(() => {
                blinkingRef.current!.style.opacity = Math.abs(parseFloat(blinkingRef.current!.style.opacity) - 1).toString();
                intervall -= step
                if (intervall <= 0) {
                    blinkingRef.current!.style.opacity = "1";
                    clearInterval(inter);
                }
            }, step);
        }
    }, [timelst]);
    return (
        <div className="home">
            {timelst.map((time: TimeList) => (
                < div className={time.id === 3 ? "timeline-spe" : "timeline"} key={time.id} >
                    {time.id === 3 && <h2 ref={blinkingRef} style={{ opacity: 1 }}>{time.title}</h2>}
                    {time.id !== 3 && <h2>{time.title}</h2>}
                </div>
            ))
            }
        </div >
    );
}

export default TimeView;