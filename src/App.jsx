import { lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventListing from "./Components/EventListing/EventListing";
import { Backdrop } from "@mui/material";
import Loader from "./Components/Loader/Loader";
import { useDataLayerValue } from "./Datalayer/DataLayer";
import { useEffect, useState } from "react";
import { Api } from "./Api/Axios";
import ProtectedRoute from "./Utils/ProtectedRoute";
import Response from "./Response/Response";
import Home from "./Components/Home/Home";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./Components/Helpers/ErrorBoundary";

const Profile = lazy(() => import("./Components/Profile/Profile"));
const Event = lazy(() => import("./Components/Event/Event"));
const Login = lazy(() => import("./Components/Authentication/Login"));
const Signup = lazy(() => import("./Components/Authentication/Signup"));
const AddEventForm = lazy(() =>
  import("./Components/Add Event Form/AddEventForm")
);
const RegisteredEvents = lazy(() =>
  import("./Components/RegisteredEvents/RegisteredEvents")
);
const Chat = lazy(() => import("./Components/Chat/Chat"));

function App() {
  const [eventList, setEventList] = useState([]);
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [{ loading, responseData, userData, loggedIn }, dispatch] =
    useDataLayerValue();
  const [gettingEvents, setGettingEvents] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  // Function to login on reload

  const loginOnReload = async () => {
    setLoggingIn(true);
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    const token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
      await Api.get("/auth/getUser")
        .then((res) => {
          dispatch({
            type: "SET_USER_DATA",
            userData: res.data.user,
          });
          dispatch({
            type: "SET_LOGIN_STATUS",
            loggedIn: true,
          });
        })
        .catch((err) => {
          localStorage.removeItem("AUTH_TOKEN");
          dispatch({
            type: "SET_LOGIN_STATUS",
            loggedIn: false,
          });
          dispatch({
            type: "SET_USER_DATA",
            userData: {},
          });
        });
    } else {
      dispatch({
        type: "SET_LOGIN_STATUS",
        loggedIn: false,
      });
    }
    if (!gettingEvents) {
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
    }
    setLoggingIn(false);
  };

  // Function to login on reload ends here

  // Functions to get event list
  const getCoords = async () => {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      return {
        lng: pos.coords.longitude,
        lat: pos.coords.latitude,
      };
    } catch (err) {
      dispatch({
        type: "SET_RESPONSE_DATA",
        responseData: {
          message: "Please enable location service",
          type: "error",
        },
      });
      return {
        lng: 0,
        lat: 0,
      };
    }
  };

  const getEventList = async () => {
    setGettingEvents(true);
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    const userCoords = await getCoords();

    await Api.get("/events/get-nearest-events", {
      params: { lat: userCoords.lat, lng: userCoords.lng },
    })
      .then((res) => {
        let events = res.data;
        let unsortedNearestEvents = res.data?.nearestEvents;
        unsortedNearestEvents.sort(
          (e1, e2) => new Date(e1.date).getTime() - new Date(e2.date).getTime()
        );
        res.data.nearestEvents = unsortedNearestEvents;
        setEventList(events);
        dispatch({
          type: "SET_EVENT_LIST",
          eventList: events,
        });
      })
      .catch((err) => {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message: "Something went wrong ... please try reloading",
            type: "error",
          },
        });
      });
    if (!loggingIn) {
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
    }
    setGettingEvents(false);
  };

  // Functions to get event list ends here

  useEffect(() => {
    if (!loggedIn) {
      loginOnReload();
    }
  }, [loggedIn]);
  useEffect(() => {
    if (eventList === null || window.location.pathname === "/") {
      getEventList();
    }
  }, [window.location.pathname]);

  return (
    <div className="App">
      <div className="main-app-dock">
        <Router>
          <Routes>
            <Route path="/" element={<Home eventList={eventList?.allEvents} />}>
              <Route
                index
                element={
                  <EventListing
                    nearbyEvents={eventList?.nearestEvents}
                    allEvents={eventList?.allEvents}
                  />
                }
              />
              <Route
                path="event/:id"
                element={<Event eventList={eventList?.allEvents} />}
              />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<Profile />} />
                <Route path="add-event" element={<AddEventForm />} />
                <Route
                  path="registered-events"
                  element={<RegisteredEvents />}
                />
                <Route path="chat/:roomId" element={<Chat />} />
                <Route path="chat/" element={<Chat />} />
              </Route>
              <Route
                path="*"
                element={
                  <EventListing
                    eventList={eventList?.nearestEvents}
                    allEvents={eventList?.allEvents}
                  />
                }
              />
            </Route>
          </Routes>
        </Router>
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: "5000000000" }} open={loading}>
        <Loader />
      </Backdrop>

      {/* Response (i.e. Error and success messages) */}
      {responseData && <Response />}
    </div>
  );
}

export default App;
