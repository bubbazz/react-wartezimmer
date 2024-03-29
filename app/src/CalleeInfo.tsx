import { FC } from "react";
import { TimeList } from "./types";

interface Props {
    calleeTime: TimeList
}

const CalleeInfo: FC<Props> = ({ calleeTime }) => {
    var timeEndsWith5 = calleeTime.title.endsWith("5");
    return (<div className="calleinfo">
        <h1>Aufruf</h1>
        {!timeEndsWith5 && <h2>Wartezimmer3</h2>}
        {timeEndsWith5 && <h2>Laborwarteplatz</h2>}
    </div>);
}

export default CalleeInfo;