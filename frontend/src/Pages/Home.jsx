import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import "./home.css";

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(isLoggedIn ? "/dashboard" : "/signin");
  };

  return (
    <div
      className="page-div"
      id="home-page"
      style={{
        backgroundImage: "url('/traffic_pic.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      <main id="main-content">
        <div id="welcome-box">
          <h1>Welcome to StreamLine!</h1>
          <p>
            StreamLine is a traffic simulation and optimization tool designed to help
            traffic managers in Utah County analyze and improve traffic flow.
          </p>

          <div className="divider">
            <h4>
              {isLoggedIn
                ? "Continue to your dashboard:"
                : "Please sign in to continue:"}
            </h4>
          </div>

          <button
            className="home-button"
            aria-label={isLoggedIn ? "Go to dashboard" : "Sign in"}
            onClick={handleButtonClick}
          >
            {isLoggedIn ? "Go to Dashboard" : "Sign In"}
          </button>

          {!isLoggedIn && (
            <button
              className="home-button"
              aria-label="Create account"
              onClick={() => navigate("/createaccount")}
            >
              Create Account
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;