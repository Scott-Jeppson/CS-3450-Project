import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx";

const CreateAccount = () => {

    return (
        // <div width="100%" body="0px" style={{ backgroundColor: 'var(--charcoal)' }}>
        //     <Navbar/>
        //     <input type="text">first name </input>
        //     <input type="text">last name </input>
        //     <input type="email">email </input>
        //     <input type="hidden">password </input>
        //     <input type="hidden">confirm password </input>
        // </div>

        <div style={{ width: "100%", height: "100vh", backgroundColor: "var(--charcoal)" }}>
            <Navbar/>
            <div className="login-form">
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
                <button type="submit" class="submit-button">Submit</button>
            </form>
        </div>
        </div>
    );
};

export default CreateAccount;