import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import './AboutUs.css';

const AboutUs = ({ isLoggedIn, setIsLoggedIn }) => {
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
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };
        checkLoginStatus();
    }, [setIsLoggedIn]);

    return (
        <div className="page-div" id="about-us-page">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <main id="main-content">
                <div id="explanation-box">
                    <h1>About Us</h1>
                    <p>
                        Streamline is the product of a group project for a class at Utah State University.
                        Us students have worked to not only learn and develop software development
                        skills, but also to create a website that has real-life applications and uses.
                    </p>
                    <p>
                        Traffic throughout Utah County is notoriously challenging with many delays
                        and frequent congestion. We set out to make an interactive tool that can 
                        potentially aid the Utah Transit Authority in making decisions regarding
                        transit routes and other decisions with day-to-day road conditions. We hope 
                        that this tool can also be of use to others who may simply want to understand
                        and visualize causes in traffic delays. While Streamline is designed to be
                        solely for Utah County, the framework and design can be applied to other
                        regions and has the modularity to allow for additional data to be incorporated.
                    </p>
                    <p>This project is for a college class which will end and us group members will
                        continue on to other classes and projects, but many of us have talked about
                        continuing developing this starting website into a more complete and more
                        comprehensive product. Working through this project, we have mostly split
                        responsibilities for development into categories of front-end (what you, the
                        user sees) and back-end (what you don't see but allows the site to function)
                        and by exercising various skills in doing so we will prepare to contribute to
                        other real-world projects throughout our careers.
                    </p>
                    <p>Streamline offers many functions and tools. Most of these tools are accessible
                        through the dashboard. The dashboard displays a map of Utah County on which a
                        simulation can be played out to show current bus routes according to the Utah
                        Transit Authority, and the user may view statistical data regarding the current
                        route's efficiency. This may be useful to both officials or simply curious
                        observers, but it is a free service to anybody who wishes to learn more.
                    </p>
                    <p>
                        In the future, we would like to include AI tools to redesign routes to show
                        potentially improved options. Additionally, we want to create a platform that
                        is more dynamic and customizable for the user to change or simulate conditions
                        and changes which they can make themselves. Currently, the simulation has many
                        limitations, but through hard work and continued research and work we can
                        certainly improve the current site to be more useful for anyone who wishes
                        to use this tool.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AboutUs;