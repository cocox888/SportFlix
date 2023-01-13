import React from "react";
import "./auth.css";
import Google from "../../Common resources/google.png";
import { Button, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Signup() {
  const navigate = useNavigate();
  return (
    <div className="login">
      <div className="login-container">
        <div className="login-main-container">
          <div className="login-heading">
            <h2>
              Welcome to{" "}
              <span style={{ color: "rgb(69,106,242)" }}>SportFlix</span>
            </h2>
            <span>Please enter your details</span>
          </div>

          <div className="login-credential-container">
            <TextField
              className="auth-input"
              label="Name"
              variant="standard"
              type="text"
            />

            <TextField
              className="auth-input"
              label="Email"
              variant="standard"
              type="email"
            />
            <TextField
              className="auth-input"
              label="Password"
              variant="standard"
              type="password"
            />
            <TextField
              className="auth-input"
              label="Confirm password"
              variant="standard"
              type="password"
            />

            <Button className="signup-button" variant="contained">
              Signup
            </Button>
            <span
              className="login-route"
              onClick={() => {
                navigate("/login");
              }}
            >
              Already have an account?{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                {" "}
                Login
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
