import React from "react";
import "./auth.css";
import Google from "../../Common resources/google.png";
import { Button, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import { Api, resetApiHeaders } from "../../Api/Axios";
function Signup() {
  const navigate = useNavigate();
  const history = useNavigate();
  const [signupData, setSignupData] = useState({});
  const [{ loggedIn }, dispatch] = useDataLayerValue();

  const changeCredentials = ({ id, value }) => {
    setSignupData((prevState) => ({ ...prevState, [id]: value }));
  };
  const signupFunction = async () => {
    if (signupData?.password === signupData?.confirmPassword) {
      dispatch({ type: "SET_LOADING", loading: true });
      const credentials = {
        name: signupData.name,
        email: signupData.email,
        dob: signupData.dob,
        password: signupData.password,
      };
      console.log(credentials);
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
              id="name"
              onChange={(e) => {
                changeCredentials(e.target);
              }}
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
            />

            <Button
              className="signup-button"
              variant="contained"
              onClick={() => signupFunction()}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
