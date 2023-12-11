import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function SignUp() {
  // Create a history object for navigation
  const history = useHistory();

  // State for username, email, and password
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle signup logic
  const handleSignUp = async () => {
    try {
      await axios.post("http://localhost:3002/api/signup", {
        username,
        email,
        password,
      });

      // After successful signup, navigate to the login page
      history.push("/login");
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form>
          {/* Username input field */}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Email input field */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input field */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Signup button */}
          <button type="button" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
