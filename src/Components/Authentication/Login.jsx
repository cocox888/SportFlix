import React, { useState } from "react";
import "./auth.css";
import Google from "../../Common resources/google.png";
import { Button, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Api, resetApiHeaders } from "../../Api/Axios";
import { useDataLayerValue } from "../../Datalayer/DataLayer";

function LoginFunc() {}

function Login() {
  const navigate = useNavigate();
  const history = useNavigate();
  const [loginCredentials, setLoginCredentials] = useState({});
  const [{ loggedIn, responseData }, dispatch] = useDataLayerValue();
  // Function to handle change values

  const changeCredentials = ({ id, value }) => {
    setLoginCredentials((prevState) => ({ ...prevState, [id]: value }));
  };

  // Function to login
  const loginFunction = async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    await Api.post("/auth/login", loginCredentials)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("AUTH_TOKEN", res.data?.token);
        resetApiHeaders(res.data?.token);
        dispatch({ type: "SET_LOGIN_STATUS", loggedIn: true });
        dispatch({
          type: "SET_USER_DATA",
          userData: res.data?.user,
        });
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: { message: res.data?.message, type: "success" },
        });

        history(-1);
      })
      .catch((err) => {
        localStorage.removeItem("AUTH_TOKEN");
        resetApiHeaders("");
        dispatch({ type: "SET_LOGIN_STATUS", loggedIn: false });
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message: err?.response?.data?.message,
            type: "error",
          },
        });
      });
    dispatch({ type: "SET_LOADING", loading: false });
  };

  return loggedIn ? (
    history(-1)
  ) : (
    <>
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
            <form
              className="login-credential-container"
              onSubmit={(e) => e.preventDefault()}
            >
              <TextField
                className="auth-input"
                label="Email"
                variant="standard"
                type="email"
                id="email"
                required
                onChange={(e) => {
                  changeCredentials(e.target);
                }}
              />
              <TextField
                className="auth-input"
                label="Password"
                variant="standard"
                type="password"
                id="password"
                required
                onChange={(e) => {
                  changeCredentials(e.target);
                }}
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
              <Button
                className="login-button"
                variant="contained"
                onClick={() => loginFunction()}
                type="submit"
              >
                Login
              </Button>
              <span
                className="signup-route"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Don't have an account?{" "}
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  {" "}
                  Signup for free
                </span>
              </span>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
