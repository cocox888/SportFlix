import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/EsriLeafletGeoSearch";
import "./addEventMap.css";
import "https://tiles.locationiq.com/v3/libs/leaflet-geocoder/1.9.6/leaflet-geocoder-locationiq.min.js";
import L from "leaflet";

function AddEventMap({ setEventLocationData }) {
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [zoom, setZoom] = useState(2);
  const [locationDetails, setLocationDetails] = useState({});
  const [markerLocation, setMarkerLocation] = useState(null);
  const mapRef = useRef();

  // getting user's location and setting the map
  const apiKey =
    "AAPK4e5268d5d850408b94a64cbe8466bc4dk5R_BZxaWXqoAnelAqQrdktOZli7YGY2HkwsHit-n532mZiJa4U0-7Q4fg4EZom-";
  const locationiq_api_key = "pk.a42110b5c004d27c9e2d214f36d0c698";

  const setTargetLocation = (data) => {
    let dataTosend = {
      latitude: data.feature.lat,
      longitude: data.feature.lon,
      location: data.feature?.display_place,
      city: data.feature?.address?.city,
      country: data.feature?.address?.country,
      state: data.feature?.address?.state,
      postcode: data.feature?.address?.postcode,
    };
    setEventLocationData(dataTosend);
    console.log(dataTosend);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log("pos");
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

          //Geocoder options
          var geocoderControlOptions = {
            bounds: false, //To not send viewbox
            markers: false, //To not add markers when we geocoder
            attribution: null, //No need of attribution since we are not using maps
            expanded: true, //The geocoder search box will be initialized in expanded mode
            panToPoint: false, //Since no maps, no need to pan the map to the geocoded-selected location
          };

          //Initialize the geocoder

          L.control
            .geocoder(locationiq_api_key, {
              // placeholder: 'Search nearby',
              url: "https://api.locationiq.com/v1",
              expanded: true,
              panToPoint: true,
              focus: true,
              position: "topleft",
            })
            .addTo(map)
            .on("select", (e) => {
              setTargetLocation(e.feature);
            });
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
