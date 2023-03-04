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

    await Api.get("/events/get-registered-events")
      .then((res) => {
        setEvents(res.data.events);
        console.log(res.data.events);
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
        {events?.map((event, i) => (
          <>
            <Card event={event} />
          </>
        ))}
      </div>
    </div>
  );
}

export default RegisteredEvents;
