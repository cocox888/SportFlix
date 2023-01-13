import React from "react";
import "./auth.css";
import Google from "../../Common resources/google.png";
import { Button, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
function Login() {
  return (
    <div className="login">
      <div className="login-container">
        <div className="login-main-container">
          <div className="login-heading">
            <h2>
              Welcome to{" "}
              <span style={{ color: "rgb(69,106,242)" }}>SportFlix</span>
            </h2>
            <span>Continue with Google or enter your details</span>
          </div>
          <div className="google-login-container">
            <img src={Google} alt="" srcset="" />
            <h4>Login with Google</h4>
          </div>
          <div className="login-partition">
            <div></div>
            <span>or</span>
            <div></div>
          </div>
          <div className="login-credential-container">
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
            <div className="login-credential-more">
              <div className="save-login">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <CheckBox
                        sx={{
                          fontSize: "19px",
                          color: "rgb(69,106,242)",
                          "&.Mui-checked": {
                            color: "rgb(69,106,242)",
                          },
                        }}
                      />
                    }
                    label="Remember me"
                  />
                </FormGroup>
              </div>
              <span className="forgot-password">Forgot password</span>
            </div>
            <Button className="login-button" variant="contained">
              Login
            </Button>
            <span className="signup-route">
              Don't have an account?{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                {" "}
                Signup for free
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
