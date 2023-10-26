import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { Add, Cancel, SearchRounded } from "@mui/icons-material";
import Card from "../ResultCard/Card";
import "./EventListing.css";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { useState } from "react";
import img1 from "../../Common resources/img1.jpeg";

function EventListing({ nearbyEvents, allEvents }) {
  const [{ loading, loggedIn, userData }, dispatch] = useDataLayerValue();
  const [eventsType, setEventsType] = useState("all");
  const [eventsToShow, setEventsToShow] = useState(nearbyEvents);
  const [searchResult, setSearchResult] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);

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

  const selectVisibleEvents = (eventsType__) => {
    let events__ = [],
      hostedEvents__ = [],
      participatedEvents__ = [];
    if (eventsType__ === "all") {
      events__ = allEvents;
    } else {
      events__ = nearbyEvents;
    }
    if (loggedIn) {
      hostedEvents__ = events__?.filter((ev) => ev.host_id === userData?._id);
      participatedEvents__ = events__?.filter(
        (ev) =>
          ev.participants.includes(userData?._id) &&
          ev.host_id !== userData?._id
      );
      events__ = events__?.filter(
        (ev) =>
          ev.host_id !== userData?._id &&
          !ev.participants.includes(userData?._id)
      );
    }
    setHostedEvents(hostedEvents__);
    setParticipatedEvents(participatedEvents__);
    setEventsToShow(events__);
    setTotalEvents(
      hostedEvents__?.length + participatedEvents__?.length + events__?.length
    );
  };

  useEffect(() => {
    selectVisibleEvents("all");
  }, [allEvents, loggedIn]);

  useEffect(() => {
    document.title = "SportFlix - We Play Together";
  }, []);

  return (
    <>
      <div className="event-add-btn-container">
        <Button variant="contained" onClick={() => navigate("add-event")}>
          {<Add sx={{ fontSize: "25px" }} />}
        </Button>
      </div>
      <div className="event-listing">
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
                  {searchResult?.length === 0 ? (
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
                          <div className="search-result-info">
                            <span>
                              {res?.location}, {res?.city}, {res?.state},
                              {res?.country}
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
          </div>
          <div className="event-listing-mid">
            <div className="result-count">
              <h2> {totalEvents ? totalEvents : 0}</h2>{" "}
              <span>
                Reults {eventsType === "nearby" ? "near you" : "worldwide"}
              </span>
            </div>
            <div className="filter-box">
              <button
                onClick={() => {
                  setEventsType("all");
                  selectVisibleEvents("all");
                }}
              >
                All Events
              </button>
              <button
                onClick={() => {
                  setEventsType("nearby");
                  selectVisibleEvents("nearby");
                }}
              >
                Nearby events
              </button>
            </div>
          </div>
        </div>
        <div className="event-listing-bottom">
          {totalEvents === 0 && (
            <p className="event-listing-bottom-heading">No Result Found</p>
          )}
          {hostedEvents?.length > 0 && (
            <p className="event-listing-bottom-heading">Hosted events</p>
          )}
          {hostedEvents?.map((event, i) => (
            <Card event={event} key={i} />
          ))}
          {participatedEvents?.length > 0 && (
            <p className="event-listing-bottom-heading">Participated events</p>
          )}
          {participatedEvents?.map((event, i) => (
            <Card event={event} key={i} />
          ))}
          {eventsToShow?.length > 0 && (
            <p className="event-listing-bottom-heading">
              Not participated events
            </p>
          )}
          {eventsToShow?.map((event, i) => (
            <Card event={event} key={i} />
          ))}
        </div>
      </div>
    </>
  );
}

export default EventListing;
