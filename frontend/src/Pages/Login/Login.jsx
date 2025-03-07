import React from "react";
import styles from "./Login.module.css"; // ✅ Correct import for module CSS

const Login = () => {
  return (
    <div className={styles["login-container"]}>
      <form className={styles["login-form"]}>
        <p className={styles.heading}>Login</p>
        <p className={styles.paragraph}>Login to your account</p>

        <div className={styles["input-group"]}>
          <input
            required
            placeholder="Username"
            name="username"
            id="username"
            type="text"
          />
        </div>

        <div className={styles["input-group"]}>
          <input
            required
            placeholder="Password"
            name="password"
            id="password"
            type="password"
          />
        </div>

        <button type="submit">Login</button>

        <div className={styles["bottom-text"]}>
          <span>
            Don't have an account? <p>Sign Up</p>
          </span>
          <p>
            <p>Forgot password?</p>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
