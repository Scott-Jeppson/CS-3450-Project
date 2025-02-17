import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import './signin.css';

const CreateAccount = () => {

    return (
        <div style={{ width: "100%", height: "100vh", backgroundColor: "var(--charcoal)" }}>
            <Navbar/>
            <div className="login-form">
                <div className="login-container">
                    <h3>Create Account</h3>
                    <form action="/dashboard.jsx">
                        <div className="login-input">
                            <label for="user_first">first name </label>
                            <input type="text" id="user_first" name="user_first"></input>
                        </div>
                        <div className="login-input">
                            <label for="user_last">last name </label>
                            <input type="text" id="user_last" name="user_last"></input>
                        </div>
                        <div className="login-input">
                            <label for="user_email">email </label>
                            <input type="email" id="user_email" name="user_email"></input>
                        </div>
                        <div className="login-input">
                            <label for="user_password">password </label>
                            <input type="password" id="user_password" name="user_password"></input>
                        </div>
                        <div className="login-input">
                            <label for="user_confirm_pw">confirm password </label>
                            <input type="password" id="user_confirm_pw" name="user_confirm_pw"></input>
                        </div>
                        <div width="100%" style={{ color: "var(--white)", textAlign: "center" }}>
                            Already have an account? <Link to ="/signin">Sign In</Link>
                        </div>
                        <button type="submit" class="submit-button">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;