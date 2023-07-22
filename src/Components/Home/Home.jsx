import React, { lazy } from "react";
import "./home.css";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../Helpers/ErrorBoundary";

const MapWrapper = lazy(() => import("./MapWrapper/MapWrapper"));

function Home({ eventList }) {
  const [{ focusMapToCenter, loggedIn }, dispatch] = useDataLayerValue();
  const navigate = useNavigate();
  // Function to handle login
  const login = () => {
    navigate("login");
    // dispatch({
    //   type: "SET_LOGIN_STATUS",
    //   loggedIn: true,
    // });
  };
  const signup = () => {
    navigate("signup");
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
        <div className={`home-container`}>
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}

export default Home;
