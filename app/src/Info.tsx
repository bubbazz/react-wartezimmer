import { FC } from "react";
interface InfoProps {
    text: string;
    id: string
}
const Info: FC<InfoProps> = ({ text, id }) => {
    var classname = "info " + id;
    return (<div className={classname} > <h1>INFO</h1>{text}</div >);
}
export default Info;