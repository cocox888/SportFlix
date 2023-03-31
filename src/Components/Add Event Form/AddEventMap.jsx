import React, { useEffect, useState, useRef } from "react";
import "./addEventMap.css";
import L from "leaflet";

function AddEventMap({ setEventLocationData }) {
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [zoom, setZoom] = useState(2);
  const mapRef = useRef();

  // getting user's location and setting the map
  const apiKey =
    "AAPK4e5268d5d850408b94a64cbe8466bc4dk5R_BZxaWXqoAnelAqQrdktOZli7YGY2HkwsHit-n532mZiJa4U0-7Q4fg4EZom-";
  const locationiq_api_key = "pk.a42110b5c004d27c9e2d214f36d0c698";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      if (pos) {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        try {
          // Initialize invisible map

          var map = L.map("map", {
            center: [pos.coords.latitude, pos.coords.longitude], // Map loads with this location as center
            zoom: 14,
            scrollWheelZoom: true,
            zoomControl: false,
            attributionControl: false,
          });

          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);

          //Initialize the geocoder
        } catch (error) {
          console.log(error);
        }
      }
    });
  }, []);

  const focusMapToUserLocation = (locationToFocus) => {
    let zoom, shiftedLocationToFocus;

    // Allign to center
    zoom = 14;

    mapRef.current?.flyTo(locationToFocus, zoom, {
      duration: 3,
    });
  };

  useEffect(() => {
    if (userLocation[0] !== 0 && userLocation[1] !== 0) {
      focusMapToUserLocation(userLocation);
    }
  }, [userLocation]);

  return (
    <div className="add-event-map-container">
      <div id="map"></div>
    </div>
  );
}

export default AddEventMap;
