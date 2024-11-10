import './SignIn.css';
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

export default function SignIn() {
  
  // Initialize state for username, password, and error message
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Handle change for username input
  const handleUsernameChange = (event) => {
    setUsername(event.target.value); // Update username state with input value
  };

  // Handle change for password input
  const handlePasswordChange = (event) => {
    setPassword(event.target.value); // Update password state with input value
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Basic validation
    if (!username || !password) {
      setError("Both username and password are required.");
    } else {
      setError(""); // Clear error if inputs are valid
      alert(`Username: ${username} \nPassword: ${password}`); // Display user data in an alert
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        backgroundImage: `url(/assets/signin.png)`, // Path to your background image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="bg-white p-4 rounded shadow-lg"
        style={{ width: "400px" }}
      >
        <h2 className="text-center mb-4">Sign In</h2>

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
              className="form-control"
            />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className="form-control"
            />
          </div>

          {/* Error message */}
          {error && <div className="text-danger mb-3">{error}</div>}

          {/* Custom Button */}
          <button
            type="submit"
            className="button d-flex align-items-center justify-content-center gap-2"
            style={{
              backgroundColor: "#2d3648", // Custom background color
              width: "100%",
              height: "50px",
              borderRadius: "20px",
              padding: "16px 24px",
              color: "#fff",
              fontSize: "25px",
              fontWeight: "400",
              letterSpacing: "-0.25px",
            }}
          >
            <span className="label">Sign In</span> {/* Custom label */}
          </button>
        </form>
      </div>
    </div>
  );
}



