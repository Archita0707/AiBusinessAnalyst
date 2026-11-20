import React from "react";
import "./Login.css";
import aiBrain from "../assets/ai-brain.png";

function Login() {
  return (
    <div className="login-container">

      {/* Left Visual Section */}
      <div className="visual-section">

        <span className="ai-badge">
          ✨ AI-Powered Analytics
        </span>

        <h1>
          Transform Data
          <br />
          Into <span>Intelligence.</span>
        </h1>

        <p>
          Unlock the power of AI to analyze,
          visualize and grow your business.
        </p>

        <img
          src={aiBrain}
          alt="AI Brain Illustration"
          className="ai-illustration"
        />

      </div>

      {/* Right Login Section */}
      <div className="form-section">

        {/* Keep your existing login form here */}

      </div>

    </div>
  );
}

export default Login;