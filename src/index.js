import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { getImpactData } from "./api/api";

import "./styles.css";

const TOKEN =
  "sk.eyJ1IjoicGhpbG1laW4yMyIsImEiOiJjanNjczd4d2cwMDEyNDNzN3lkMnZzYmQxIn0.hYLJk5bWY9Biuhj9ak1ivg";

const LEAFLET_URL = `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${TOKEN}`;
const ATTRIBUTION =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
function App() {
  let [impactData, addImpactData] = useState([]);
  let [filteredData, applyFilter] = useState([]);
  let [yearStart, setYearStart] = useState(null);
  let [yearEnd, setYearEnd] = useState(null);
  let myMap = null;
  let bounds = null;
  let myFGmarker = null;

  const applyDefaultFilter = dataset => {
    return dataset.filter(data => {
      return new Date(data.year) >= new Date("1/1/2010");
    });
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
    console.log(filteredData);
    applyFilter(filteredData);
  };

  const initMap = () => {
    console.log(window.L);
    myMap = window.L.map("mapid");
    bounds = window.L.latLngBounds();
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
      filteredData.forEach(data => {
        let { coordinates } = data.geolocation;
        myFGmarker.addLayer(addMarker(coordinates));
        myFGmarker.addTo(myMap);
      });

      myMap.fitBounds(myFGmarker.getBounds());
      addImpactData(data);
      applyFilter(filteredData);
    });
  }, []);

  return (
    <main className="App">
      <div id="mapid" />
      <section>
        <form>
          <fieldset>
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
          </fieldset>
          <button onClick={applyTimeWindowFilter}>Apply Filter</button>
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
