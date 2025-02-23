import React, { useState } from "react";
import "./ForgetPassword.css";

const ForgetPassword = () => {
  const [resetMsg, setResetMsg] = useState("");

  const processResetRequest = (event) => {
    event.preventDefault();
    const userEmail = event.target.userEmail.value.trim();

    if (!userEmail) {
      setResetMsg("Enter your email to proceed.");
      return;
    }

    setResetMsg("If the email is registered, a reset link has been sent.");
  };

  return (
    <div className="reset-box">
      <h2>Password Reset</h2>
      <p>Provide your email to receive a reset link.</p>
      <form onSubmit={processResetRequest}>
        <input type="email" name="userEmail" placeholder="Enter your email" required />
        <button type="submit">Send Reset Link</button>
      </form>
      {resetMsg && <p className="status-msg">{resetMsg}</p>}
    </div>
  );
};

export default ForgetPassword;

