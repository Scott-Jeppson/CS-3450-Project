import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import './signin.css';
import { useNavigate } from 'react-router-dom';

const CreateAccount = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [accountData, setAccountData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [errorMessage, setMessage] = useState("");
    const handleChange = (e) => {
        setAccountData({ ...accountData, [e.target.name]: e.target.value });
    };
    const validateAccount = () => {
        let newErrors = {};

        if (!accountData.firstName) newErrors.firstName = "First name is required.";
        if (!accountData.lastName) newErrors.lastName = "Last name is required.";
        if (!accountData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(accountData.email)) {
            newErrors.email = "Invalid email.";
        }
        if (!accountData.password) newErrors.password = "Password is required.";
        if (accountData.password.length < 10) newErrors.password = "Password must be at least 10 characters.";
        if (!accountData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
        if (accountData.password !== accountData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAccount()) return;
        try {
            const response = await fetch("http://localhost:8080/api/createaccount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_first: accountData.firstName,
                    user_last: accountData.lastName,
                    user_email: accountData.email,
                    user_password: accountData.password
                }),
            });
            const result = await response.json();
            if (response.ok) {
                //Automatically log user in or just clear form and notify them the account was created???
                const loginResponse = await fetch("http://localhost:8080/api/signin",{
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_email: accountData.email,
                        user_password: accountData.password
                    }),
                });
                const loginResult = await loginResponse.json();
                if (loginResponse.ok){
                    localStorage.setItem("loginToken", loginResult.token);
                    setIsLoggedIn(true);
                    navigate('/dashboard');
                }
                else{
                    setMessage(loginResult.message || "Error logging in.");
                }
            } else {
                setMessage(result.error || "Error creating account.");
            }
        } 
        catch (error) {
            setMessage("Network error. Please try again later.");
        }
    };
    return (
        <div className="page-div" style={{ backgroundColor: "var(--charcoal)" }}>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <div className="login-form">
                <div className="login-container">
                    <h3>Create Account</h3>
                    {errorMessage && <p aria-live="assertive" role="alert" style={{color:"white", textAlign:"center", backgroundColor: "var(--error-red)"}}>{errorMessage}</p>}
                    <form onSubmit={handleSubmit}>
                    <div className="login-input">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" name="firstName" aria-required="true" value={accountData.firstName} onChange={handleChange} />
                            {errors.firstName && <p className="error" role="alert" aria-live="assertive">{errors.firstName}</p>}
                        </div>
                        <div className="login-input">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" name="lastName" aria-required="true" value={accountData.lastName} onChange={handleChange} />
                            {errors.lastName && <p className="error" role="alert" aria-live="assertive">{errors.lastName}</p>}
                        </div>
                        <div className="login-input">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" aria-required="true" value={accountData.email} onChange={handleChange} />
                            {errors.email && <p className="error" role="alert" aria-live="assertive">{errors.email}</p>}
                        </div>
                        <div className="login-input">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" aria-required="true" value={accountData.password} onChange={handleChange} />
                            {errors.password && <p className="error" role="alert" aria-live="assertive">{errors.password}</p>}
                        </div>
                        <div className="login-input">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" aria-required="true" value={accountData.confirmPassword} onChange={handleChange} />
                            {errors.confirmPassword && <p className="error" role="alert" aria-live="assertive">{errors.confirmPassword}</p>}
                        </div>
                        <div width="100%" style={{ color: "var(--white)", textAlign: "center" }}>
                            Already have an account? <Link to="/signin" role="alert" aria-label="Sign in to existing account">Sign In</Link>
                        </div>
                        <button type="submit" aria-label="Submit" className="submit-button">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;