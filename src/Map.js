import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const TOKEN =
  "sk.eyJ1IjoicGhpbG1laW4yMyIsImEiOiJjanNjczd4d2cwMDEyNDNzN3lkMnZzYmQxIn0.hYLJk5bWY9Biuhj9ak1ivg";

const LEAFLET_URL = `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${TOKEN}`;
const ATTRIBUTION =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

let myMap = null;
let myFGmarker = null;

export default function Map({ filteredData }) {
  useEffect(() => {
    initMap();
  }, []);

  useEffect(
    () => {
      addGeocoordinates(filteredData);
    },
    [filteredData]
  );

  const initMap = () => {
    myMap = window.L.map("mapid");
    myFGmarker = window.L.featureGroup();

    window.L.tileLayer(LEAFLET_URL, {
      attribution: ATTRIBUTION,
      noWrap: true
    }).addTo(myMap);
  };

  const addMarker = coordinates => {
    let marker = window.L.marker(coordinates);
    return marker;
  };

  const clearMarkers = () => {
    myFGmarker.clearLayers();
  };

  const addGeocoordinates = dataset => {
    clearMarkers();

    dataset.forEach(data => {
      if (data.geolocation) {
        let coordinates = data.geolocation.coordinates;
        if (coordinates) {
          myFGmarker.addLayer(addMarker(coordinates));
          myFGmarker.addTo(myMap);
        }
      }
    });

    myMap.fitBounds(myFGmarker.getBounds());
  };

  return <div id="mapid" />;
}
