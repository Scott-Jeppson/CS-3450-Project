import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from './Pages/Home.jsx';
import SignIn from './Pages/SignIn.jsx';
import CreateAccount from './Pages/CreateAccount.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import AboutUs from  './Pages/AboutUs.jsx';
import Optimization from './Pages/OptimizationInformation.jsx';

// Main component of the app where the routing and global state management is defined
function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("loginToken"));
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
            <Route path="/signin" element={<SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/createaccount" element={<CreateAccount isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn}/>}/>
            <Route path="/about" element={<AboutUs isLoggedIn={isLoggedIn}/>}/>
            <Route path="/optimization" element={<Optimization isLoggedIn={isLoggedIn}/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App
