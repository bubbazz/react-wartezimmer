import { Dispatch, SetStateAction } from "react";
import { w3cwebsocket } from "websocket";

export interface TimeList {
    id: number,
    title: string
}
export interface PropsTimeList {
    time: TimeList[],
    setTime: Dispatch<SetStateAction<TimeList[]>>
    websocket: w3cwebsocket
}
