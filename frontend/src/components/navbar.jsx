import './navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {

    return (
        <nav id='navbar'>
            <div id="nav-brand">
                <Link to="/">
                    <img id="logo" src="src/assets/Logo-Light-Purple-Circle.svg" />
                </Link>
                <Link to="/" id="nav-name">
                    <h2>StreamLine</h2>
                </Link>
            </div>
            <Link to="/SignIn" id="nav-button">Sign In</Link>
        </nav>
    );
}

export default Navbar;