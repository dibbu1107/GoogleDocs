import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";
import { v4 as uuidV4 } from "uuid";

function Login() {
  // Create a history object for navigation
  const history = useHistory();

  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login logic
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3002/api/login", {
        email,
        password,
      });

      // Extract data from the response
      const { token, userId, username } = response.data;

      // Store token, userId, and username in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);

      // After successful login, navigate to a document page with a unique ID
      history.push(`/documents/${uuidV4()}`);
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        <form>
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

          {/* Login button */}
          <button type="button" onClick={handleLogin}>
            Login
          </button>

          {/* Signup link */}
          <p>
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
