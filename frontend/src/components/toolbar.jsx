import './toolbar.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/constants";

function Toolbar({ isLoggedIn, setIsLoggedIn }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toolbarRef = useRef(null);
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
    setIsCollapsed(true);
    navigate("/");
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        !isCollapsed &&
        !e.target.closest("#toggle-drawer") &&
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target)
      ) {
        setIsCollapsed(true);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [isCollapsed]);

  return (
    <>
      <button
        id="toggle-drawer"
        onClick={() => setIsCollapsed(c => !c)}
        aria-expanded={!isCollapsed}
        aria-label="Menu"
      >☰</button>

      <div
        className={`toolbar ${isCollapsed ? "collapsed" : ""}`}
        ref={toolbarRef}
      >
        <Link to="/" className="drawer-link">Home</Link>
        {isLoggedIn && (
          <Link
            to="/"
            className="drawer-link"
            onClick={handleLogout}
          >
            Log Out
          </Link>
        )}
      </div>
    </>
  );
}

export default Toolbar;