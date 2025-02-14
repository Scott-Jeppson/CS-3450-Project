import './navbar.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getHelloWorld } from "../api";

function Navbar() {
    const [testMessage, setTestMessage] = useState("");

    useEffect(() => {
            async function fetchMessage() {
                const testData = await getHelloWorld();
                setTestMessage(testData.message);
            }
            fetchMessage();
        }, []);

    return (
        <div className='navbar'>
            <h2>StreamLine</h2>
            <h4>Backend Response: {testMessage}</h4>
            {/* <a href="/signin">Sign In</a> */}
            {/* <h4>Hello</h4> */}
            <Link to="/signin">Sign In</Link>
        </div>
    );
}

export default Navbar;


// {/* <div className='navbar'>
//             <h2>StreamLine</h2>
//             <h4>Backend Response: {testMessage}</h4>
//             {/* <a href="/signin">Sign In</a> */}
//             {/* <h4>Hello</h4> */}
//             {/* <Link to="/signin">Sign In</Link> */}
//             {/* <li>
//                 <Link to="/signin">Sign In</Link>
//             </li>

//             <Switch>
//                 <Route path="signin" component={ SignIn }/>
//             </Switch> */}

//             {/* <Router>
//         <nav>
//             <ul>
//             <li>
//                 <Link to="/">Home</Link>
//             </li>
//             <li>
//                 <Link to="/about">About</Link>
//             </li>
//             </ul>
//         </nav>

//         <Switch>
//             <Route path="/" exact component={HomePage} />
//             <Route path="/about" component={AboutPage} />
//         </Switch>
//         </Router> */}
//         </div> */}