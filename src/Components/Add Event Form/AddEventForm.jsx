import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../../Api/Axios";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import "./addEvent.css";
import AddEventMap from "./AddEventMap";
function AddEventForm() {
  const [{ userData }, dispatch] = useDataLayerValue();
  const [eventDetails, setEventDetails] = useState({});
  const navigate = useNavigate();

  const setEventLocationData = (data) => {
    setEventDetails((prevState) => ({ ...prevState, location: data }));
  };

  const changeEventData = (e) => {
    const { id, value } = e.target;
    setEventDetails((prevState) => ({ ...prevState, [id]: value }));
  };

  const addEventDataFunc = async (e) => {
    e.preventDefault();
    const eventDataToPush = {
      host: userData?.name,
      participants: [userData?._id],
      ...eventDetails,
      ...eventDetails.location,
    };
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

  return (
    <div className="add-event-form">
      <div className="add-event-form-container">
        <div className="add-event-back">
          <button>
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
              <TextField
                className="add-event-input-field"
                variant="standard"
                label="Type Of Sport"
                id="type"
                onChange={(e) => changeEventData(e)}
                required
              />
              <TextField
                id="date"
                label="Date Of Gathering"
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
                label="Maximum Players (optional)"
                type="number"
                InputProps={{ inputProps: { min: 2 } }}
                variant="standard"
                className="add-event-input-field"
                id="max_players"
                onChange={(e) => changeEventData(e)}
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
              <TextField
                label="Location"
                type="text"
                variant="standard"
                className="add-event-input-field"
                placeholder="Select from map"
                value={
                  eventDetails?.location && eventDetails?.location?.location
                }
                id="location_name"
                onChange={(e) => (e.target.value = "")}
                required
              />
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
            <AddEventMap setEventLocationData={setEventLocationData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEventForm;
