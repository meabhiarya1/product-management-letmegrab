import React, { useState } from "react";
import styles from "./Login.module.css"; // ✅ Correct import for module CSS
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
        user // ✅ Send user directly
      );

      const token = response.data.token; // ✅ Extract token
      if (token) {
        localStorage.setItem("token", token); // ✅ Store token
        alert("Login successful!");
        window.location.href = "/dashboard"; // ✅ Redirect
      } else {
        alert("Invalid response, no token received.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data?.error || error.message);
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className={styles["login-container"]}>
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <p className={styles.heading}>Login</p>
        <p className={styles.paragraph}>Login to your account</p>

        <div className={styles["input-group"]}>
          <input
            required
            placeholder="email"
            name="email"
            id="email"
            type="email"
            onChange={handleChange}
          />
        </div>

        <div className={styles["input-group"]}>
          <input
            required
            placeholder="Password"
            name="password"
            id="password"
            type="password"
            onChange={handleChange}
          />
        </div>

        <button type="click">Login</button>

        {/* <div className={styles["bottom-text"]}>
          <span>
            Don't have an account? <p>Sign Up</p>
          </span>
          <p>
            <p>Forgot password?</p>
          </p>
        </div> */}
      </form>
    </div>
  );
};

export default Login;
