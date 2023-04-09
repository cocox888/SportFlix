import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./addEventMap.css";
import L from "leaflet";

function AddEventMap({ markerLocation }) {
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [zoom, setZoom] = useState(2);
  const mapRef = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      if (pos) {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
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

  useEffect(() => {
    if (markerLocation[0] !== 0 && markerLocation[1] !== 0) {
      focusMapToUserLocation(markerLocation);
    }
  }, [markerLocation]);

  return (
    <MapContainer center={userLocation} zoom={zoom} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors"
      />
      {markerLocation[0] !== 0 && markerLocation[1] !== 0 && (
        <Marker position={markerLocation}></Marker>
      )}
    </MapContainer>
  );
}

export default AddEventMap;
