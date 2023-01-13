import { ArrowBack, PeopleAltRounded } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import "./Event.css";
import img1 from "../../Common resources/img1.jpg";
import img2 from "../../Common resources/img2.png";
import { Button } from "@mui/material";

function Event({ eventList }) {
  const urlParams = useParams();
  const navigate = useNavigate();
  const [imageSelected, setImageSelected] = useState(0);
  const [{ focusMapToCenter }, dispatch] = useDataLayerValue();
  const [eventInfo, setEventInfo] = useState({});
  useEffect(() => {
    const eventId = urlParams.id;
    const selectedEvent = eventList.filter((event) => event.id === eventId);
    setEventInfo(selectedEvent[0]);
  }, [urlParams]);

  return (
    <div className="event-container">
      <div
        className="event-back"
        onClick={() => {
          navigate("/");
          // dispatch({ type: "SET_FOCUS_MAP_TO_CENTER", focusMapToCenter: true });
        }}
      >
        <ArrowBack sx={{ color: "rgb(162 161 161)", fontSize: "17px" }} />{" "}
        <span>Back</span>
      </div>
      <div className="event-main-container">
        <div className="event-top">
          <img className="event-main-img" src={img1}></img>
          <div className="event-info event-more-images">
            <div className="event-more-images-container">
              <img
                className="event-more-img event-more-img-selected"
                src={img1}
              ></img>
              <img className="event-more-img" src={img2}></img>
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
              <div className="event-info event-date">{eventInfo?.date}</div>
              <div className="event-info event-people">
                <PeopleAltRounded sx={{ marginRight: "3px" }} />
                <span>10</span>
              </div>
            </div>

            <div className="event-info event-desc">
              <p>Event details</p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
              vero a magnam similique. Voluptates, quibusdam!
            </div>

            <Button variant="contained" className="event-join-btn">
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;
