import React from "react";
import "./home.css";
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import {
    Cancel,
    PowerSettingsNewRounded,
} from "@mui/icons-material";
import MapWrapper from "./MapWrapper/MapWrapper";
import { useDataLayerValue } from "../../Datalayer/DataLayer"
import Sidebar from "../Sidebar/Sidebar";
import Home from "./Home"
import { Outlet } from "react-router-dom";
import EventListing from "../EventListing/EventListing";

function HomeDock() {
    const [{ alignMap, loggedIn }, dispatch] = useDataLayerValue();

    const eventList =
        [
            {
                id: "event1",
                type: "cricket",
                location: "DSA Stadium, South Baluchar, Malda, West Bengal",
                coordinates: [24.997936889216756, 88.14851917039425],
                date: "24th Dec",
                peopleJoined: 10
            },
            {
                id: "event2",
                type: "football",
                location: "Brindabani Maidan",
                coordinates: [24.99761222867918, 88.14528246392283],
                date: "24th Dec",
                peopleJoined: 10
            },
            {
                id: "event3",
                type: "badminton",
                location: "Malda College Ground",
                coordinates: [25.00175881167985, 88.13757176967077],
                date: "24th Dec",
                peopleJoined: 10
            },
        ]
    // Function to handle login
    const login = () => {
        dispatch({
            type: "SET_LOGIN_STATUS",
            loggedIn: true
        })
    }
    // Function to handle logout
    const logout = () => {
        dispatch({
            type: "SET_LOGIN_STATUS",
            loggedIn: false
        })
    }


    return (
        <>
            <Sidebar />
            <div className="user-location">
                <MyLocationRoundedIcon sx={{ fontSize: "20px" }} onClick={() => {
                    dispatch({ type: "SET_FOCUS_MAP_TO_CENTER", focusMapToCenter: true })
                }} />
            </div>
            <div className="home-login-container">
                {
                    !loggedIn ?
                        <div className="home-login-loggedOut-container">
                            <button onClick={() => login()}>Login</button>
                            <button>Signup</button>
                        </div> :
                        <div className="home-login-loggedIn-container">
                            <PowerSettingsNewRounded sx={{ color: "red", margin: "5px", cursor: "pointer" }} onClick={() => logout()} />
                        </div>}
            </div>
            <div className="home-map">
                <MapWrapper eventList={eventList} />
            </div>
            <Outlet />
        </>
    );
}

export default HomeDock;
