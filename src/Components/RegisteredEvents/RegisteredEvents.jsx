import { KeyboardArrowLeftOutlined } from "@mui/icons-material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../../Api/Axios";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import Card from "../ResultCard/Card";
import "./registered.css";

function RegisteredEvents() {
  const history = useNavigate();
  const [{ loading }, dispatch] = useDataLayerValue();
  const [events, setEvents] = useState([]);
  const getRegisteredEvents = async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    let upcoming, past;
    const today = new Date();

    await Api.get("/events/get-registered-events")
      .then((res) => {
        upcoming = res.data.events?.filter(
          (event) => new Date(event.date) >= today
        );
        past = res.data.events?.filter((event) => new Date(event.date) < today);
        setEvents({ upcoming: upcoming, past: past });
      })
      .catch((err) => {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message:
              err?.response?.data?.message ||
              "Something went wrong ... please try again",
            type: "error",
          },
        });
      });

    await Api.get("/events/get-hosted-events")
      .then((res) => {
        setEvents((prevState) => ({
          ...prevState,
          hosted: res?.data?.hostedEvents,
        }));
      })
      .catch((err) => {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message: err?.response?.data?.message || "No event hosted by you",
            type: "error",
          },
        });
      });

    dispatch({ type: "SET_LOADING", loading: false });
  };
  useEffect(() => {
    getRegisteredEvents();
  }, []);

  return (
    <div className="RegEvents">
      <h2 className="reg-head">
        <div className="reg-back-container" onClick={() => history(-1)}>
          <KeyboardArrowLeftOutlined />
        </div>
        <span>Registered Events</span>
      </h2>
      <div className="reg-events-container">
        {events?.hosted?.length !== 0 && (
          <div className="reg-events-inner-container">
            <span>Hosted events</span>
            <div className="reg-events-container-main">
              {events?.hosted?.map((event, i) => (
                <>
                  <Card event={event} />
                </>
              ))}
            </div>
          </div>
        )}

        {events?.upcoming?.length !== 0 && (
          <div className="reg-events-inner-container">
            <span>Upcoming events</span>
            <div className="reg-events-container-main">
              {events?.upcoming?.map((event, i) => (
                <>
                  <Card event={event} />
                </>
              ))}
            </div>
          </div>
        )}
        {events?.past?.length !== 0 && (
          <div className="reg-events-inner-container">
            <span>Past events</span>
            <div className="reg-events-container-main">
              {events?.past?.map((event, i) => (
                <>
                  <Card event={event} />
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisteredEvents;
