import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import './OptimizationInformation.css';

const Optimization = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/is_logged_in", {
                    method: "GET",
                    credentials: "include",
                });
                const result = await response.json();
                if (response.ok && result.logged_in) {
                    setIsLoggedIn(true);
                } else{
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };
        checkLoginStatus();
    }, [setIsLoggedIn]);

    return (
        <div className="page-div" id="optimization-page">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <main id="main-content">
                <div id="optimization-info">
                    <h1>Optimization Methods</h1>
                        PLACEHOLDER
                </div>
            </main>
        </div>
    );
};

export default Optimization;