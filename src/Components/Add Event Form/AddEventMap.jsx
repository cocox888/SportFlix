import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/EsriLeafletGeoSearch";
import "./addEventMap.css";
// import Map from "mapmyindia-react";
// import MapmyIndia from "mapmyindia-react";

function AddEventMap({ setEventLocationData }) {
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [zoom, setZoom] = useState(2);
  const [locationDetails, setLocationDetails] = useState({});
  const [markerLocation, setMarkerLocation] = useState(null);
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

  const focusMapToUserLocation = (locationToFocus) => {
    let zoom, shiftedLocationToFocus;

    // Allign to center
    zoom = 14;

    mapRef.current?.flyTo(locationToFocus, zoom, {
      duration: 3,
    });
  };

  // Set event location

  const setEventLocation = (data) => {
    const eventLocationData = {
      location: data?.results[0]?.properties?.PlaceName,
      country: data?.results[0]?.properties?.CntryName,
      state: data?.results[0]?.properties?.Region,
      district: data?.results[0]?.properties?.Subregion,
      city: data?.results[0]?.properties?.City,
      sector: data?.results[0]?.properties?.Sector,
      locatlity: data?.results[0]?.properties?.District,
      pinCode: data?.results[0]?.properties?.Postal,
      latitude: data?.latlng?.lat,
      longitude: data?.latlng?.lng,
    };
    setEventLocationData(eventLocationData);
    setMarkerLocation({
      name: data?.results[0]?.properties?.PlaceName,
      lat: data?.latlng?.lat,
      lng: data?.latlng?.lng,
    });
  };

  useEffect(() => {
    if (userLocation[0] !== 0 && userLocation[1] !== 0) {
      focusMapToUserLocation(userLocation);
    }
  }, [userLocation]);
  const apiKey =
    "AAPK4e5268d5d850408b94a64cbe8466bc4dk5R_BZxaWXqoAnelAqQrdktOZli7YGY2HkwsHit-n532mZiJa4U0-7Q4fg4EZom-";
  return (
    <div className="add-event-map-container">
      <MapContainer center={userLocation} zoom={zoom} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="__blank">OpenStreetMap</a> contributors'
        />
        {markerLocation && (
          <Marker position={[markerLocation?.lat, markerLocation?.lng]}>
            <Popup>{markerLocation?.name}</Popup>
          </Marker>
        )}
        <EsriLeafletGeoSearch
          providers={{
            arcgisOnlineProvider: {
              token: apiKey,
              label: "ArcGIS Online Results",
              maxResults: 20,
            },
          }}
          position="topright"
          eventHandlers={{
            results: (data) => setEventLocation(data),
          }}
        />
      </MapContainer>
    </div>
  );
}

export default AddEventMap;
