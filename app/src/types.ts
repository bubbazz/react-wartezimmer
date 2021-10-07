import { Dispatch, SetStateAction } from "react";

export interface TimeList {
    id: number,
    title: string
}
export interface PropsTimeList {
    time: TimeList[],
    setTime: Dispatch<SetStateAction<TimeList[]>>
}
