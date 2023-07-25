import React, { lazy } from "react";
import "./home.css";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../Helpers/ErrorBoundary";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import { useState } from "react";

const MapWrapper = lazy(() => import("./MapWrapper/MapWrapper"));

function Home({ eventList }) {
  const [{ loggedIn, homeHidden }, dispatch] = useDataLayerValue();
  const navigate = useNavigate();
  // Function to handle login
  const login = () => {
    navigate("login");
  };
  const signup = () => {
    navigate("signup");
  };

  const toggleHomeHidden = () => {
    dispatch({
      type: "SET_HOME_HIDDEN",
      homeHidden: !homeHidden,
    });
  };

  return (
    <>
      <Sidebar />
      <div
        className="user-location"
        onClick={() => {
          dispatch({
            type: "SET_FOCUS_MAP_TO_CENTER",
            focusMapToCenter: true,
          });
        }}
      >
        <MyLocationRoundedIcon sx={{ fontSize: "20px" }} />
      </div>

      <div className="home-login-container">
        {!loggedIn && (
          <div className="home-login-loggedOut-container">
            <button onClick={() => login()}>Login</button>
            <button onClick={() => signup()}>Signup</button>
          </div>
        )}
      </div>
      <div className="Home">
        <div className="home-map">
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
            <Suspense fallback={<div>Loading...</div>}>
              <MapWrapper eventList={eventList} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      <div
        className={` home-container ${homeHidden && "home-container-hidden"}`}
      >
        <div className="home-container-toggler">
          <button
            className={`home-container-toggler-container ${
              homeHidden && "home-container-toggler-container-up"
            }`}
            onClick={() => toggleHomeHidden()}
          >
            <KeyboardArrowDownRounded
              sx={
                homeHidden
                  ? { transform: "rotate(180deg)", transition: "all 250ms" }
                  : { transition: "all 250ms" }
              }
            />
          </button>
        </div>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
          <Suspense fallback={<div>Loading...</div>}>
            <div className={`home-dock ${homeHidden && "home-blurred"}`}>
              <Outlet />
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}

export default Home;
