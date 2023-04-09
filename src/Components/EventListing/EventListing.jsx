import React, { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Button,
} from "@mui/material";
import { Add, Cancel, SearchRounded } from "@mui/icons-material";
import Card from "../ResultCard/Card";
import "./EventListing.css";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { useState } from "react";

function EventListing({ nearbyEvents, allEvents }) {
  const [{ loading }, dispatch] = useDataLayerValue();
  const [userCoordinates, setUserCoordinates] = useState([0, 0]);
  const [userLocation, setUserLocation] = useState();
  const [eventsType, setEventsType] = useState("all");
  const [eventsToShow, setEventsToShow] = useState(nearbyEvents);
  const [searchResult, setSearchResult] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();

  const changeDateFormat = (rawDate) => {
    const d = new Date(rawDate);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const date = d.getDate();
    const year = d.getFullYear();
    return `${month} ${date}, ${year}`;
  };

  const getSearchResult = (e) => {
    const key = e.target.value.toLowerCase();
    setSearchKey(key);
    let result = allEvents?.filter(
      (ev) =>
        ev?.city?.toLowerCase().includes(key) ||
        ev?.country?.toLowerCase().includes(key) ||
        ev?.description?.toLowerCase().includes(key) ||
        ev?.state?.toLowerCase().includes(key) ||
        ev?.location?.toLowerCase().includes(key) ||
        ev?.type?.toLowerCase().includes(key)
    );
    //console.log(result);
    setSearchResult(result);
  };

  useEffect(() => {
    //console.log(allEvents);
    setEventsToShow(allEvents);
  }, [allEvents]);

  return (
    <div className="event-listing">
      <div className="event-add-btn-container">
        <Button variant="contained" onClick={() => navigate("add-event")}>
          {<Add sx={{ fontSize: "25px" }} />}
        </Button>
      </div>
      <div className="event-listing-controller">
        <div className="event-listing-top">
          <div className="searchbar">
            <input
              type="text"
              className="searchbar-inp"
              placeholder="Search for location or sports"
              onChange={(e) => getSearchResult(e)}
            />
            {searchKey !== "" && (
              <div className="search-result-container">
                {searchResult.length === 0 ? (
                  "No result found"
                ) : (
                  <div className="search-result-container-main">
                    <span className="search-key">
                      {<SearchRounded sx={{ color: "rgba(162,162,162)" }} />}
                      {searchKey}
                    </span>
                    {searchResult?.map((res, i) => (
                      <div
                        className="search-result-line"
                        onClick={() => {
                          navigate(`/event/${res._id}`);
                        }}
                      >
                        <div className="search-result-img"></div>
                        <div className="search-result-info">
                          <span>
                            {res?.city},{res?.country}
                          </span>
                          <span>{res.type}</span>
                          <span>{changeDateFormat(res?.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* <div className="filter-box">
            <div className="filter-box-container">
              <div className="filter-container"></div>

              <div className="selected-filter">
                <div className="selected-filter-field">
                  <span>Patia</span>{" "}
                  <Cancel className="remove-filter" fontSize="small" />{" "}
                </div>
              </div>
              <div className="selected-filter">
                <div className="selected-filter-field">
                  <span>Cricket</span>
                  <Cancel className="remove-filter" fontSize="small" />
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="event-listing-mid">
          <div className="result-count">
            <h2> {eventsToShow?.length}</h2>{" "}
            <span>Reults {eventsType === "nearby" && "near you"}</span>
          </div>
          <div className="filter-box">
            <button
              onClick={() => {
                setEventsType("all");
                setEventsToShow(allEvents);
              }}
            >
              All Events
            </button>
            <button
              onClick={() => {
                setEventsType("nearby");
                setEventsToShow(nearbyEvents);
              }}
            >
              Nearby events
            </button>
          </div>
        </div>
      </div>
      <div className="event-listing-bottom">
        {eventsToShow?.map((event) => (
          <Card event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventListing;
