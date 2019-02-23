import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { getImpactData } from "./api/api";
import Map from "./Map";

import "./styles.css";

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

  const applyTimeWindowFilter = e => {
    e.preventDefault();

    let filteredData = impactData.filter(data => {
      let dataYear = new Date(data.year).getFullYear();
      if (yearStart && yearEnd) {
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
    getImpactData().then(data => {
      let filteredData = applyDefaultFilter(data);
      addImpactData(data);
      applyFilter(filteredData);
    });
  }, []);

  const renderMap = () => {
    return filteredData.length ? <Map filteredData={filteredData} /> : null;
  };

  return (
    <main className="container">
      {renderMap()}
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
                <button className="primary" onClick={applyTimeWindowFilter}>
                  Apply Filter
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </section>
      <section className="flex-layout">
        <div className="header-row">
          <div>Timestamp</div>
          <div>ID</div>
          <div>Name</div>
          <div>Mass</div>
          <div>RecClass</div>
          <div>RecLat</div>
          <div>RecLng</div>
        </div>
        {filteredData.map(data => {
          return (
            <div className="item-row">
              <div>{data.year}</div>
              <div>{data.id}</div>
              <div>{data.name}</div>
              <div>{data.mass}</div>
              <div>{data.recclass}</div>
              <div>{data.reclat}</div>
              <div>{data.reclong}</div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
