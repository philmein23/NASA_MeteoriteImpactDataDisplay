import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { getImpactData } from "./api/api";

import "./styles.css";

let myMap = null;
let myFGmarker = null;

const TOKEN =
  "sk.eyJ1IjoicGhpbG1laW4yMyIsImEiOiJjanNjczd4d2cwMDEyNDNzN3lkMnZzYmQxIn0.hYLJk5bWY9Biuhj9ak1ivg";

const LEAFLET_URL = `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${TOKEN}`;
const ATTRIBUTION =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
function App() {
  let [impactData, addImpactData] = useState([]);
  let [filteredData, applyFilter] = useState([]);
  let [yearStart, setYearStart] = useState("");
  let [yearEnd, setYearEnd] = useState("");

  const applyDefaultFilter = dataset => {
    return dataset.filter(data => {
      return new Date(data.year) >= new Date("1/1/2010");
    });
  };

  const addGeocoordinates = dataset => {
    myFGmarker.clearLayers();

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

  const applyTimeWindowFilter = e => {
    e.preventDefault();

    let filteredData = impactData.filter(data => {
      let dataYear = new Date(data.year).getFullYear();
      if (yearStart && yearEnd) {
        console.log(yearStart, yearEnd);
        return dataYear >= Number(yearStart) && dataYear <= Number(yearEnd);
      }

      if (yearStart) {
        return dataYear >= Number(yearStart);
      }

      if (yearEnd) {
        return dataYear <= Number(yearEnd);
      }
    });

    applyFilter(filteredData);
    addGeocoordinates(filteredData);
  };

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

  const clearMarkers = e => {
    e.preventDefault();
    myFGmarker.clearLayers();
  };

  const onHandleChange = e => {
    let { value, name } = e.target;

    if (name === "yearStart") {
      setYearStart(value);
    }

    if (name === "yearEnd") {
      setYearEnd(value);
    }
  };

  useEffect(() => {
    initMap();
    getImpactData().then(data => {
      let filteredData = applyDefaultFilter(data);
      addGeocoordinates(filteredData);
      addImpactData(data);
      applyFilter(filteredData);
    });
  }, []);

  return (
    <main className="container">
      <div id="mapid" />
      <section className="filter-control">
        <form>
          <fieldset>
            <div className="filters">
              <div>
                <label>Year Start</label>
                <input
                  name="yearStart"
                  type="text"
                  placeholder="Year Start"
                  value={yearStart}
                  onChange={onHandleChange}
                />
              </div>
              <div>
                <label>Year End</label>
                <input
                  name="yearEnd"
                  type="text"
                  placeholder="Year End"
                  value={yearEnd}
                  onChange={onHandleChange}
                />
              </div>
              <div className="button-container">
                <button onClick={applyTimeWindowFilter}>Apply Filter</button>
                <button onClick={clearMarkers}>Clear Markers</button>
              </div>
            </div>
          </fieldset>
        </form>
      </section>
      <section>
        {filteredData.map(data => {
          return <div>{data.year}</div>;
        })}
      </section>
    </main>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
