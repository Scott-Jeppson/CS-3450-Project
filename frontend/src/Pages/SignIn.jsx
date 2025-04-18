import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import './signin.css';
import { API_BASE_URL } from "@/constants.js";

const SignIn = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/is_logged_in`, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        if (response.ok && result.logged_in) {
          localStorage.setItem("loginToken", "true");
          setIsLoggedIn(true);
          navigate("/dashboard");
        } else {
          localStorage.removeItem("loginToken");
          setIsLoggedIn(false);
        }
      } catch {
      }
    };
    checkLoginStatus();
  }, [navigate, setIsLoggedIn]);

  const handleChange = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const validateAccount = () => {
    const newErrors = {};
    if (!accountData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(accountData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!accountData.password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAccount()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_email: accountData.email,
          user_password: accountData.password,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("loginToken", "true");
        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        setErrorMessage(result.error || "Error logging in.");
      }
    } catch {
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="page-div" style={{ backgroundColor: "var(--charcoal)" }}>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="login-form">
        <div className="login-container">
          <h3>Sign In</h3>

          {errorMessage && (
            <p
              role="alert"
              aria-live="assertive"
              style={{
                color: "white",
                textAlign: "center",
                backgroundColor: "var(--error-red)",
                padding: "0.5rem",
              }}
            >
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate autoComplete="on">
            <div className="login-input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                aria-required="true"
                value={accountData.email}
                onChange={handleChange}
                autoComplete="username"
                required
              />
              {errors.email && (
                <p className="error" aria-live="assertive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="login-input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                aria-required="true"
                value={accountData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              {errors.password && (
                <p className="error" aria-live="assertive">
                  {errors.password}
                </p>
              )}
            </div>

            <div style={{ color: "var(--white)", textAlign: "center" }}>
              Don't have an account?{" "}
              <Link to="/createaccount" aria-label="Create an account">
                Create Account
              </Link>
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;