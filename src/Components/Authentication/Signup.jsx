import React, { useEffect } from "react";
import "./auth.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { Button, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import { Api, resetApiHeaders } from "../../Api/Axios";
function Signup() {
  const navigate = useNavigate();
  const history = useNavigate();
  const location = useLocation();
  const [signupData, setSignupData] = useState({});
  const [historyExists, setHistoryExists] = useState(false);

  const [{ loggedIn }, dispatch] = useDataLayerValue();

  const changeCredentials = ({ id, value }) => {
    setSignupData((prevState) => ({ ...prevState, [id]: value }));
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
  const signupFunction = async (e) => {
    e.preventDefault();
    if (signupData?.password === signupData?.confirmPassword) {
      dispatch({ type: "SET_LOADING", loading: true });
      const credentials = {
        name: signupData.name,
        email: signupData.email,
        dob: signupData.dob,
        password: signupData.password,
      };
      //console.log(credentials);
      await Api.post("/auth/signup", credentials)
        .then((res) => {
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
          dispatch({
            type: "SET_USER_DATA",
            userData: {},
          });
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
    } else {
      dispatch({
        type: "SET_RESPONSE_DATA",
        responseData: {
          message: "Passwords did not match",
          type: "error",
        },
      });
    }
  };

  useEffect(() => {
    document.title = "Signup - SportFlix";
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
    <div className="login">
      <div className="signup-container">
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
                  onSuccess={(credentialResponse) =>
                    googleLogin(credentialResponse)
                  }
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
              <span>Please enter your details</span>
            </div>
          </div>
          <form
            className="login-credential-container"
            onSubmit={(e) => signupFunction(e)}
          >
            <TextField
              className="auth-input"
              label="Name"
              variant="standard"
              type="text"
              id="name"
              onChange={(e) => {
                changeCredentials(e.target);
              }}
              required
            />

            <TextField
              className="auth-input"
              label="Email"
              variant="standard"
              type="email"
              id="email"
              onChange={(e) => {
                changeCredentials(e.target);
              }}
              required
            />
            <TextField
              id="dob"
              label="Date of birth"
              type="date"
              variant="standard"
              className="auth-input"
              onChange={(e) => {
                changeCredentials(e.target);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField
              className="auth-input"
              label="Password"
              variant="standard"
              type="password"
              id="password"
              onChange={(e) => {
                changeCredentials(e.target);
              }}
              required
            />
            <TextField
              className="auth-input"
              label="Confirm password"
              variant="standard"
              type="password"
              id="confirmPassword"
              onChange={(e) => {
                changeCredentials(e.target);
              }}
              required
            />

            <Button
              className="signup-button"
              sx={{ bgcolor: "#0C7F51" }}
              variant="contained"
              type="submit"
            >
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
