import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useDataLayerValue } from "../../../Datalayer/DataLayer";
import { useNavigate, useParams } from "react-router-dom";
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/EsriLeafletGeoSearch";
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

  const defaultSportIcon = new Icon({
    iconUrl: require("./Resources/default.png"),
    iconSize: [35, 35],
  });
  const urlParams = useParams();
  const navigate = useNavigate();

  const [{ focusMapToCenter }, dispatch] = useDataLayerValue();
  const mapRef = useRef();

  // getting user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log("pos");
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
        locationToFocus[0] + 0.001,
        locationToFocus[1] - 0.025,
      ];
    }

    // Focus to selected event
    else {
      zoom = 18;
      shiftedLocationToFocus = [
        locationToFocus[0],
        locationToFocus[1] - 0.0015,
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

  // Looking for selected event

  useEffect(() => {
    const { id } = urlParams;
    if (id) {
      const targetEvent = eventList.filter((event) => event.id === id);
      const targetCoordinates = targetEvent[0].coordinates;
      focusMapToLocation(targetCoordinates, false);
    }
  }, [urlParams]);

  return (
    <MapContainer center={userLocation} zoom={zoom} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="__blank">OpenStreetMap</a> contributors'
      />
      <Marker position={userLocation} icon={userLocationIcon}>
        <Popup>Your location</Popup>
      </Marker>
      {eventList.map((event) => (
        <Marker
          eventHandlers={{
            click: () => {
              navigate(`/event/${event.id}`);
            },
          }}
          key={event.id}
          position={event?.coordinates}
          icon={
            new Icon({
              iconUrl: require(`./Resources/${event?.type}.png`),
              iconSize: [35, 35],
            })
          }
        >
          <Popup>{event?.location}</Popup>
        </Marker>
      ))}
      {/* {enableSearch && (
        <EsriLeafletGeoSearch
          providers={{
            arcgisOnlineProvider: {
              token:
                "AAPK4e5268d5d850408b94a64cbe8466bc4dk5R_BZxaWXqoAnelAqQrdktOZli7YGY2HkwsHit-n532mZiJa4U0-7Q4fg4EZom-",
              label: "ArcGIS Online Results",
              maxResults: 10,
            },
          }}
          position="topright"
        />
      )} */}
    </MapContainer>
  );
}

export default MapWrapper;
