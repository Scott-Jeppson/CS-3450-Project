import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import './signin.css';

const SignIn = ({ isLoggedIn, setIsLoggedIn }) => {

    return (
        <div className="page-div" style={{ backgroundColor: "var(--charcoal)" }}>
            <Navbar/>
            <div className="login-form">
                <div className="login-container">
                    <h3>Sign In</h3>
                    <form action="/dashboard.jsx">
                        <div className="login-input">
                            <label for="user_email">email </label>
                            <input type="email" id="user_email" name="user_email"></input>
                        </div>
                        <div className="login-input">
                            <label for="user_password">password </label>
                            <input type="password" id="user_password" name="user_password"></input>
                        </div>
                        <div width="100%" style={{ color: "var(--white)", textAlign: "center" }}>
                            Don't have an account? <Link to ="/createaccount">Create Account</Link>
                        </div>
                        <button type="submit" class="submit-button">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
