import React from "react";
import "./auth.css";
import Google from "../../Common resources/google.png";
import { Button, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
// import { BaseAdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@material-ui/pickers";

// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
function Signup() {
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

export default Signup;
