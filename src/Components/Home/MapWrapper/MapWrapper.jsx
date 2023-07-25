import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useDataLayerValue } from "../../../Datalayer/DataLayer";
import { useNavigate, useParams } from "react-router-dom";
import "./mapwrapper.css";

function MapWrapper({ eventList }) {
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [enableSearch, setEnableSearch] = useState(true);
  const [zoom, setZoom] = useState(2);
  const userLocationIcon = new Icon({
    iconUrl: require("./Resources/person.png"),
    iconSize: [55, 55],
    iconAnchor: [28, 10],
    popupAnchor: [0, -10],
  });

  const maxBounds = [
    [-90, -180],
    [90, 180],
  ];

  const urlParams = useParams();
  const navigate = useNavigate();

  const [{ focusMapToCenter, homeHidden }, dispatch] = useDataLayerValue();
  const mapRef = useRef();

  const getSportIcon = (sportName) => {
    try {
      const icon = require(`./Resources/${sportName.toLowerCase()}.png`);
      return icon;
    } catch (err) {
      const icon = require("./Resources/default.png");
      return icon;
    }
  };

  // getting user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      // //console.log(pos);
      if (pos) {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      }
    });
  }, []);

  const focusMapToLocation = (locationToFocus, center) => {
    let zoom, shiftedLocationToFocus;

    // Allign to center
    if (center) {
      zoom = 14;
      shiftedLocationToFocus = [
        locationToFocus[0] + (homeHidden === false ? 0.001 : 0),
        locationToFocus[1] - (homeHidden === false ? 0.025 : 0),
      ];
    }

    // Focus to selected event
    else {
      zoom = 18;
      shiftedLocationToFocus = [
        locationToFocus[0],
        locationToFocus[1] - (homeHidden === false ? 0.0015 : 0),
      ];
    }
    mapRef.current?.flyTo(shiftedLocationToFocus, zoom, {
      duration: 3,
    });

    dispatch({ type: "SET_FOCUS_MAP_TO_CENTER", focusMapToCenter: false });
  };

  useEffect(() => {
    const { id } = urlParams;

    if (
      (userLocation[0] !== 0 && userLocation[1] !== 0 && id === undefined) ||
      focusMapToCenter
    ) {
      focusMapToLocation(userLocation, true);
    }
  }, [userLocation, focusMapToCenter]);

  useEffect(() => {
    dispatch({
      type: "SET_FOCUS_MAP_TO_LOCATION_FUNCTION",
      focusMapToLocation: focusMapToLocation,
    });
  }, []);

  return (
    <MapContainer
      center={userLocation}
      zoom={zoom}
      ref={mapRef}
      maxBounds={maxBounds}
      minZoom={2}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="__blank">OpenStreetMap</a> contributors'
      />
      <Marker position={userLocation} icon={userLocationIcon}>
        <Popup>Your location</Popup>
      </Marker>
      {eventList?.map((event) => (
        <Marker
          eventHandlers={{
            click: () => {
              navigate(`/event/${event?._id}`);
              dispatch({ type: "FLY_TO_LOCATION", id: event?._id });
              dispatch({ type: "SET_HOME_HIDDEN", homeHidden: false });
            },
          }}
          key={event?._id}
          position={[event?.latitude, event?.longitude]}
          icon={
            new Icon({
              iconUrl: getSportIcon(event?.type),
              iconSize: [35, 35],
            })
          }
        >
          <Popup>{event?.location}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapWrapper;
