import { FC } from "react";
import { TimeList } from "./types";

interface Props {
    calleeTime: TimeList
}

const CalleeInfo: FC<Props> = ({ calleeTime }) => {
    return (<div className="CalleeInfo">
        <h1>Aufruf</h1>
        {calleeTime.title.endsWith("5") && <h2>Wartezimmer3</h2>}
        {<h2>Laborwarteplatz</h2>}
    </div>);
}

export default CalleeInfo;