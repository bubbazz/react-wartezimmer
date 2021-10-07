import { Link } from "react-router-dom";
const NavigationsBar = () => {
    return (
        <nav className="navbar">
            <h1>Wartezimmer-App</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/admin">Admin</Link>
            </div>
        </nav>
    );
}

export default NavigationsBar;