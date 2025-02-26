import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from './Pages/Home.jsx';
import SignIn from './Pages/SignIn.jsx';
import CreateAccount from './Pages/CreateAccount.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Test from './Pages/Test.jsx';
import Dashboard from './Pages/Dashboard.jsx';

// Main component of the app where the routing and global state management is defined
function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("loginToken"));

    /*
        Updates the login status based on the loginToken in local storage that is set when the user logs in.
        The isLoggedIn state is also manually updated when the user logs in/out because the storage event listener
        does not pick up on changes to the local storage in the same window, only in other windows/tabs. It is
        still important to have the event listener to update the login status if the user logs in/out in another tab.
    */
    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("loginToken"));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/createaccount" element={<CreateAccount isLoggedIn={setIsLoggedIn} />} />
            <Route path="/dashboard" element={<Dashboard isLoggedIn={setIsLoggedIn}/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App
