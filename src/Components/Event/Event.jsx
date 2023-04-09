import { ArrowBack, PeopleAltRounded } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import "./Event.css";
import img1 from "../../Common resources/img1.jpeg";
import img2 from "../../Common resources/img2.png";
import { Button } from "@mui/material";
import { Api } from "../../Api/Axios";

function Event() {
  const urlParams = useParams();
  const navigate = useNavigate();
  const history = useNavigate();
  const [imageSelected, setImageSelected] = useState(0);
  const [{ loggedIn, userData, focusMapToCenter }, dispatch] =
    useDataLayerValue();
  const [eventInfo, setEventInfo] = useState({});

  // Location event on map
  const locateEvent = () => {
    dispatch({ type: "FLY_TO_LOCATION", id: eventInfo._id });
  };

  // Function to change date format
  const changeDateFormat = (rawDate) => {
    const d = new Date(rawDate);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[d.getMonth()];
    const date = d.getDate();
    const year = d.getFullYear();
    return `${month} ${date} , ${year}`;
  };

  // Function to get target event details
  const getEventDetails = async (eventId) => {
    dispatch({ type: "SET_LOADING", loading: true });

    await Api.get("/events/get-event-by-id", { params: { eventId: eventId } })
      .then((res) => {
        setEventInfo(res.data?.event);
      })
      .catch((err) => {
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

  // Function to join event
  const joinEvent = async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    const eventId = eventInfo?._id;
    await Api.post("/events/join-event", { eventId: eventId })
      .then((res) => {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: { message: res.data?.message, type: "success" },
        });
        navigate("/");
      })
      .catch((err) => {
        //console.log(err);
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

  const userAlreadyRegistered = () => {
    const userId = userData?._id;
    return eventInfo?.participants?.includes(userId);
  };

  useEffect(() => {
    const eventId = urlParams.id;
    getEventDetails(eventId);
  }, [urlParams?.id]);
  return (
    <div className="event-container">
      <div
        className="event-back"
        onClick={() => {
          history(-1);
          // dispatch({ type: "SET_FOCUS_MAP_TO_CENTER", focusMapToCenter: true });
        }}
      >
        <ArrowBack sx={{ color: "rgb(162 161 161)", fontSize: "17px" }} />{" "}
        <span>Back</span>
      </div>
      <div className="event-main-container">
        <div className="event-top">
          <img className="event-main-img" src={img2}></img>
          <div className="event-info event-more-images">
            <div className="event-more-images-container">
              <img className="event-more-img" src={img2}></img>
              <img
                className="event-more-img event-more-img-selected"
                src={img1}
              ></img>
            </div>
          </div>
          <div className="event-info event-host">
            Hosted by {eventInfo?.host}
          </div>
          <div className="event-top-container">
            <div className="event-info event-location">
              <h3>{eventInfo?.location}</h3>
            </div>
            <div className="event-info-date-participants">
              <div className="event-info event-date">
                {changeDateFormat(eventInfo?.date)}
              </div>
              <div className="event-info event-people">
                <PeopleAltRounded sx={{ marginRight: "3px" }} />
                <span>{eventInfo?.participants?.length}</span>
              </div>
              {eventInfo?.max_players && (
                <div className="event-info event-people">
                  <span>Maximum players : {eventInfo?.max_players}</span>
                </div>
              )}
              {eventInfo?.min_age && (
                <div className="event-info event-people">
                  <span>Minimum age : {eventInfo?.min_age}</span>
                </div>
              )}
            </div>

            {eventInfo?.description && (
              <div className="event-info event-desc">
                <p>Event details</p>
                {eventInfo?.description}
              </div>
            )}
            <div className="event-interaction-btns">
              {loggedIn && userAlreadyRegistered() ? (
                <Button
                  variant="contained"
                  className="event-join-btn"
                  onClick={() => navigate("/chat")}
                >
                  Go to chat
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className="event-join-btn"
                  onClick={() => joinEvent()}
                >
                  Participate
                </Button>
              )}
              <Button
                variant="contained"
                className="event-join-btn"
                onClick={() => locateEvent()}
              >
                Go to location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;
