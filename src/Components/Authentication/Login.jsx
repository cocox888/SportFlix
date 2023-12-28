import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

import React, { useState } from "react";
import "./auth.css";
import { Button, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { Api, resetApiHeaders } from "../../Api/Axios";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const history = useNavigate();
  const location = useLocation();
  const [loginCredentials, setLoginCredentials] = useState({});
  const [historyExists, setHistoryExists] = useState(false);
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
        //console.log(res.data);
        resetApiHeaders(res.data?.token);
        localStorage.setItem("AUTH_TOKEN", res.data?.token);
        dispatch({ type: "SET_LOGIN_STATUS", loggedIn: true });
        dispatch({
          type: "SET_USER_DATA",
          userData: res.data?.user,
        });
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: { message: res.data?.message, type: "success" },
        });
        if (historyExists) {
          if (location.state?.from) {
            navigate(location.state.from);
          } else {
            history(-1);
          }
        } else {
          navigate("/profile");
        }
      })
      .catch((err) => {
        localStorage.removeItem("AUTH_TOKEN");
        resetApiHeaders("");
        dispatch({ type: "SET_LOGIN_STATUS", loggedIn: false });
        dispatch({
          type: "SET_USER_DATA",
          userData: {},
        });
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

  const googleLogin = async (data) => {
    dispatch({ type: "SET_LOADING", loading: true });
    await Api.post("/auth/googleLogin", data)
      .then((res) => {
        //console.log(res.data);
        resetApiHeaders(res.data?.token);
        localStorage.setItem("AUTH_TOKEN", res.data?.token);
        dispatch({ type: "SET_LOGIN_STATUS", loggedIn: true });
        dispatch({
          type: "SET_USER_DATA",
          userData: res.data?.user,
        });
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: { message: res.data?.message, type: "success" },
        });
        if (historyExists) {
          if (location.state?.from) {
            navigate(location.state.from);
          } else {
            history(-1);
          }
        } else {
          navigate("/profile");
        }
      })
      .catch((err) => {
        localStorage.removeItem("AUTH_TOKEN");
        resetApiHeaders("");
        dispatch({ type: "SET_LOGIN_STATUS", loggedIn: false });
        dispatch({
          type: "SET_USER_DATA",
          userData: {},
        });
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

  useEffect(() => {
    document.title = "Login - SportFlix";
    const doesAnyHistoryEntryExist = location.key !== "default";
    setHistoryExists(doesAnyHistoryEntryExist);
  }, []);

  return loggedIn ? (
    historyExists ? (
      history(-1)
    ) : (
      navigate("/profile")
    )
  ) : (
    <>
      <div className="login">
        <div className="login-container">
          <div className="login-main-container">
            <div className="login-heading">
              <h2>
                Welcome to <span style={{ color: "#0C7F51" }}>SportFlix</span>
              </h2>
            </div>
            <div className="google-login-container">
              <div className="google-login-main">
                <GoogleOAuthProvider
                  clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
                >
                  <GoogleLogin
                    width={"100%"}
                    onSuccess={(credentialResponse) => {
                      googleLogin(credentialResponse);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </GoogleOAuthProvider>
              </div>
              <div className="google-login-container-partition-wrapper">
                <div className="google-login-container-partition">
                  <div className=""></div>
                  <div className="google-login-container-partition-line"></div>
                  <span>or</span>
                  <div className="google-login-container-partition-line"></div>
                </div>
                <span>Please enter your credentials</span>
              </div>
            </div>
            {/* <div className="login-partition">
              <div></div>
              <span>or</span>
              <div></div>
            </div> */}
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
                sx={{ bgcolor: "#0C7F51" }}
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
