import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import React from "react";
import { API_BASE_URL } from '@/constants';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/signout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("loginToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav id={isLoggedIn ? "navbar-logged-in" : "navbar"}>
      <div id="nav-left">
        <Link
          to={isLoggedIn ? "/dashboard" : "/"}
          id="nav-brand"
          aria-label={isLoggedIn ? "StreamLine Dashboard" : "StreamLine Home"}
        >
          <img
            id="logo"
            alt=""
            src={
              isLoggedIn
                ? "/Logo-White-Text-Purple-Background.svg"
                : "/Logo-Light-Purple-Circle.svg"
            }
          />
          <h2 id="nav-name">StreamLine</h2>
        </Link>
      </div>
      <div>
        {isLoggedIn ? (
          <Link
            to="/"
            id="nav-button"
            aria-label="Log out"
            onClick={handleLogout}
          >
            Log Out
          </Link>
        ) : (
          <Link to="/signin" id="nav-button" aria-label="Sign in">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;