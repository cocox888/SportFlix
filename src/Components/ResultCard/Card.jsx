import {
  LocationCityRounded,
  LocationOn,
  PeopleAltRounded,
  SportsCricket,
  SportsCricketRounded,
} from "@mui/icons-material";
import React, { useEffect } from "react";
import "./card.css";
import notFound from "./img.jpg";
import { useNavigate } from "react-router-dom";
import img1 from "../../Common resources/img1.jpg";
import { useDataLayerValue } from "../../Datalayer/DataLayer";

function Card({ event }) {
  const navigate = useNavigate();
  const [{ hello }, dispatch] = useDataLayerValue();
  const selectEvent = () => {
    dispatch({ type: "FLY_TO_LOCATION", id: event._id });
    navigate(`/event/${event._id}`);
  };
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
    return `${month} ${date}`;
  };

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
            <span>{changeDateFormat(event?.date)}</span>
            <span>{event?.type}</span>
            <span>
              {<PeopleAltRounded sx={{ marginRight: "10px" }} />}{" "}
              {event?.participants?.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
