import { Button, TextField } from "@mui/material";

import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../../Api/Axios";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import "./addEvent.css";
import AddEventMap from "./AddEventMap";
import { LocationIQProvider } from "leaflet-geosearch";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Delete, KeyboardArrowLeftRounded } from "@mui/icons-material";

function AddEventForm() {
  const [{ userData }, dispatch] = useDataLayerValue();
  const [searchKey, setSearchKey] = useState("");
  const [eventDetails, setEventDetails] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [imageFiles, setImageFiles] = useState([]);
  const [markerLocation, setMarkerLocation] = useState([0, 0]);
  const navigate = useNavigate();
  const history = useNavigate();
  const [screenWidth, setScreenWidth] = useState(null);
  const location_iq_api_key = process.env.REACT_APP_LOCATION_IQ_API_KEY;
  const maxFileSize = 10 * 1024 * 1024; // 10 MB
  const maxFiles = 4;
  // Upload images
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles?.forEach((file) => {
        const fileUrl = URL.createObjectURL(file);
        Object.assign(file, { url: fileUrl });
      });
      setImageFiles(acceptedFiles);
    },
    [imageFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: maxFiles,
    maxSize: maxFileSize,
    accept: {
      "image/*": [],
    },
    onDrop,
    onDropRejected: (rejectedFiles) => {
      const fileSizeError = rejectedFiles.find(
        (file) => file.errors[0].code === "file-too-large"
      );
      const fileCountError = rejectedFiles.find(
        (file) => file.errors[0].code === "too-many-files"
      );
      if (fileSizeError) {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message: `File "${fileSizeError.file.name}" exceeds the maximum size limit.`,
            type: "error",
          },
        });
      } else if (fileCountError) {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message: `You can only upload ${maxFiles} files.`,
            type: "error",
          },
        });
      }
    },
  });

  const removeImage = (file) => {
    const filteredFiles = imageFiles.filter((arrFile) => arrFile !== file);
    console.log(filteredFiles);
    setImageFiles(filteredFiles);
  };

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
    const baseURL = process.env.REACT_APP_BASEURL;

    const newFD = new FormData();
    for (let key in eventDataToPush) {
      newFD.append(key, eventDataToPush[key]);
    }
    imageFiles.forEach((file, index) => {
      newFD.append(`file${index + 1}`, file);
    });
    dispatch({ type: "SET_LOADING", loading: true });

    await axios
      .post(`${baseURL}/events/add-event`, newFD, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
          "Content-Type": "multipart/form-data",
        },
      })
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
        dispatch({ type: "SET_LOADING", loading: false });
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

  const changeScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", changeScreenWidth);
  }, []);

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

                {/* Drop files */}
                <div {...getRootProps()} className="add-event-drop-file">
                  <input {...getInputProps()} accept=".jpg,.png,.jpeg" />
                  {isDragActive ? (
                    <p className="add-event-drop-file-inp">
                      Drop the files here ...
                    </p>
                  ) : (
                    <p className="add-event-drop-file-inp">
                      Drag 'n' drop, or click to upload images
                    </p>
                  )}
                </div>

                {/* Image preview */}
                <div
                  className={`${
                    imageFiles.length !== 0 && "add-event-image-preview"
                  }`}
                >
                  {imageFiles?.map((file, i) => (
                    <>
                      <div className="add-event-preview-image-container">
                        <img key={i} src={file.url} alt="image preview" />
                        <div
                          className="add-event-remove-image-btn"
                          onClick={() => {
                            removeImage(file);
                          }}
                        >
                          <Delete sx={{ fontSize: "25px" }} />
                        </div>
                      </div>
                    </>
                  ))}
                </div>

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
                {screenWidth < 1000 && (
                  <div className="mobile-event-map">
                    <AddEventMap markerLocation={markerLocation} />
                  </div>
                )}
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
          {screenWidth >= 1000 && (
            <div className="add-event-form-right">
              <AddEventMap markerLocation={markerLocation} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddEventForm;
