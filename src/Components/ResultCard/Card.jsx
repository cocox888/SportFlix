import {
  LocationCityRounded,
  LocationOn,
  PeopleAltRounded,
  SportsCricket,
  SportsCricketRounded,
} from "@mui/icons-material";
import React from "react";
import "./card.css";
import notFound from "./img.jpg";
import { useNavigate } from "react-router-dom"
import img1 from "../../Common resources/img1.jpg"

function Card({ event }) {

  const navigate = useNavigate();
  const selectEvent = () => {
    navigate(`/event/${event.id}`)
  }

  return (
    <div className="Card" onClick={() => selectEvent()}>
      <div className="card-container">
        <div className="card-container-main">
          <div className="card-top">
            <div className="card-img">
              <img src={img1} alt="" />
            </div>
            <div className="card-details">
              <div className="card-main-details">
                <div className="card-location">
                  <LocationOn />
                  <h4>{event?.location}</h4>
                </div>
                <div className="card-type">
                  <SportsCricketRounded />
                </div>
              </div>
            </div>
          </div>
          <div className="card-bottom">
            <span>{event?.date}</span>
            <span>{event?.type}</span>
            <span>{<PeopleAltRounded sx={{ marginRight: "10px" }} />} {event?.peopleJoined}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
