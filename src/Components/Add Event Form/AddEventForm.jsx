import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../../Api/Axios";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import "./addEvent.css";
import AddEventMap from "./AddEventMap";
import { LocationIQProvider } from "leaflet-geosearch";
import L from "leaflet";
import axios from "axios";

function AddEventForm() {
  const [{ userData }, dispatch] = useDataLayerValue();
  const [searchKey, setSearchKey] = useState("");
  const [eventDetails, setEventDetails] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [markerLocation, setMarkerLocation] = useState([0, 0]);
  const navigate = useNavigate();
  const history = useNavigate();
  const location_iq_api_key = process.env.REACT_APP_LOCATION_IQ_API_KEY;

  const provider = new LocationIQProvider({
    params: {
      key: location_iq_api_key,
    },
  });

  const changeEventData = (e) => {
    const { id, value } = e.target;
    setEventDetails((prevState) => ({ ...prevState, [id]: value }));
  };

  const addEventDataFunc = async (e) => {
    e.preventDefault();
    const target_loc = {
      longitude: selectedLocation?.raw?.lon,
      latitude: selectedLocation?.raw?.lat,
      location: selectedLocation?.raw?.display_name?.split(",")[0],
      city: selectedLocation?.city,
      state: selectedLocation?.state,
      country: selectedLocation?.country,
    };
    const eventDataToPush = {
      host: userData?.name,
      participants: [userData?._id],
      ...eventDetails,
      ...target_loc,
    };
    //console.log(eventDataToPush);
    dispatch({ type: "SET_LOADING", loading: true });
    await Api.post("/events/add-event", eventDataToPush)
      .then((res) => {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: { message: res.data?.message, type: "success" },
        });

        navigate("/");
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

  const searchLocation = async (e) => {
    const key = e.target.value;
    setSearchKey(key);
    try {
      const res = await provider?.search({ query: key });
      // //console.log(res);
      setSearchResults(res);
    } catch (err) {
      //console.log(err);
    }
  };

  const handleLocationSelect = async (loc) => {
    dispatch({ type: "SET_LOADING", loading: true });
    const lat = loc?.raw?.lat;
    const lon = loc?.raw?.lon;
    await axios
      .get(
        `https://us1.locationiq.com/v1/reverse?key=${location_iq_api_key}&lat=${lat}&lon=${lon}&format=json`
      )
      .then((res) => {
        loc.city = res.data.address.city;
        loc.state = res.data.address.state;
        loc.country = res.data.address.country;
        //console.log(loc);
        setSearchResults([]);
        setSelectedLocation(loc);
        setSearchKey(loc?.raw?.display_name);
        setMarkerLocation([lat, lon]);
      })
      .catch((err) => {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message: "Something went wrong with the selected location",
            type: "error",
          },
        });
      });

    dispatch({ type: "SET_LOADING", loading: false });
  };

  return (
    <div className="add-event-form">
      <div className="add-event-form-container">
        <div className="add-event-back">
          <button onClick={() => history(-1)}>
            <KeyboardArrowLeftRounded /> Back
          </button>
        </div>
        <div className="add-event-form-main-container">
          <div className="add-event-form-left">
            <form
              onSubmit={(e) => {
                addEventDataFunc(e);
              }}
              className="add-event-input-form"
            >
              <div className="add-event-form-fields">
                <h3 className="add-event-form-heading">Add Event Details</h3>
                <TextField
                  label="Host Name"
                  value={userData?.name}
                  variant="filled"
                  className="add-event-input-field"
                  InputProps={{
                    readOnly: true,
                  }}
                  id="host"
                  onChange={(e) => changeEventData(e)}
                />
                <div className="add-event-location-inp-container">
                  <TextField
                    label="Location"
                    type="text"
                    variant="standard"
                    className="add-event-input-field"
                    placeholder="Select from map"
                    id="location_name"
                    value={searchKey}
                    onChange={(e) => {
                      searchLocation(e);
                    }}
                    autoComplete="off"
                    required
                  />
                  {(!selectedLocation || searchResults?.length !== 0) && (
                    <div className="add-event-location-results-container">
                      {searchResults?.map((res, i) => (
                        <p
                          key={i}
                          className="aelr-search-card"
                          onClick={() => handleLocationSelect(res)}
                        >
                          {res?.raw?.display_name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <TextField
                  className="add-event-input-field"
                  variant="standard"
                  label="Type Of Sport"
                  id="type"
                  onChange={(e) => changeEventData(e)}
                  required
                />
                <TextField
                  className="add-event-input-field"
                  variant="standard"
                  label="Description"
                  id="description"
                  onChange={(e) => changeEventData(e)}
                  multiline
                  required
                />
                <TextField
                  id="date"
                  label="Date"
                  type="date"
                  variant="standard"
                  className="add-event-input-field"
                  onChange={(e) => changeEventData(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
                <TextField
                  label="Maximum Players"
                  type="number"
                  InputProps={{ inputProps: { min: 2 } }}
                  variant="standard"
                  className="add-event-input-field"
                  id="max_players"
                  onChange={(e) => changeEventData(e)}
                  required
                />
                <TextField
                  label="Minimum Age (optional)"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  variant="standard"
                  className="add-event-input-field"
                  id="min_age"
                  onChange={(e) => changeEventData(e)}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                className="add-event-form-btn"
              >
                Add Event
              </Button>
            </form>
          </div>
          <div className="add-event-form-right">
            <AddEventMap markerLocation={markerLocation} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEventForm;
