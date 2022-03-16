import { React, useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import styled from "styled-components";

function App() {
  const keys = ["name", "wmi", "country", "createdOn", "vehicleType"];
  const labels = ["Name", "WMI", "Country", "Created On", "Vehicle Type"];

  const countries = [
    "View All",
    "United States (USA)",
    "Canada",
    "Mexico",
    "China",
    "United Kingdom (UK)",
    "Japan",
    "Hong Kong",
    "Spain",
    "Belgium",
  ];

  const [loading, setLoading] = useState(true);
  const [carData, setCarData] = useState(undefined);
  const [filteredData, setFilteredData] = useState(undefined);
  const [countryFilter, setCountryFilter] = useState(undefined);
  const [searchInput, setSearchInput] = useState(undefined);

  useEffect(() => {
    let baseUri = "https://localhost:44301";

    axios
      .get(`${baseUri}/honda`)
      .then(({ data }) => {
        let newData = data.sort((item1, item2) => {
          let newDate = new Date(item1.createdOn);
          let newDate2 = new Date(item2.createdOn);

          //Order the table from newest to oldest
          if (newDate > newDate2) return -1;
          if (newDate < newDate2) return 1;

          //Order by WMI alphabetically
          if (item1.wmi > item2.wmi) return -1;
          if (item1.wmi < item2.wmi) return 1;
        });

        setCarData(newData);
        setFilteredData(newData);

        setLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (!loading) {
      let newFilteredData = carData;

      //If a search query exists
      if (searchInput) {
        newFilteredData = newFilteredData.filter((data) => {
          let matches = false;

          Object.entries(data).map((entry) => {
            if (
              entry[1]
                .toString()
                .toLowerCase()
                .includes(searchInput.toLowerCase())
            ) {
              matches = true;
            }
          });

          return matches;
        });
      } //End filtering by search

      //If a country is selected
      if (countryFilter) {
        newFilteredData = newFilteredData.filter((data) => {
          if (data.country.toLowerCase() == countryFilter.toLowerCase())
            return true;
        });
      }

      setFilteredData(newFilteredData);
    }
  }, [countryFilter, searchInput]);

  const searchInputHandler = (e) => {
    setSearchInput(e.target.value);
  };

  const countryInputHandler = (e) => {
    if (e.target.value == "View All") setCountryFilter(undefined);
    else setCountryFilter(e.target.value);
  };

  const clearSearchInput = () => {
    setSearchInput("");
  };

  const getRowsJsx = () => {
    return filteredData.map((d) => {
      const wmi = d.wmi;
      return (
        <tr key={wmi}>
          {keys.map((k) => (
            <td key={`${wmi}-${k}`}>{d[k]}</td>
          ))}
        </tr>
      );
    });
  };

  return (
    <div className="App">
      {loading && <div>Loading Car Data</div>}

      {!loading && (
        <div>
          <Filters>
            <label>Select A Country</label>
            <select onChange={countryInputHandler} id="country" name="country">
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <input
              type="text"
              id="search"
              placeholder="Enter a search term to filter results"
              onChange={searchInputHandler}
              value={searchInput}
            ></input>
            <button onClick={clearSearchInput}>Clear Search</button>
          </Filters>

          <WmiTable>
            <header>
              WMI Data - Honda | Total: {carData.length} | Found:
              {filteredData.length}
            </header>
            <table>
              <thead>
                <tr>
                  {keys.map((k, index) => (
                    <th key={k}>{labels[index]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{getRowsJsx()}</tbody>
            </table>
          </WmiTable>
        </div>
      )}
    </div>
  );
}

export default App;

const Filters = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  label {
    font-size: 24px;
    margin-right: 1rem;
  }
  select {
    margin-right: 1rem;
    height: 50px;
  }
  input {
    margin-right: 1rem;
    width: 400px;
  }
`;

const WmiTable = styled.div`
  width: 80%;
  margin: 0 auto;
  margin-top: 2rem;
  background-color: #ddddff;
  border-radius: 5px;
  padding: 2rem;
  header {
    margin-bottom: 1rem;
    font-size: 24px;
  }
  table {
    border-spacing: 4px;
    width: 100%;
  }
  tr {
    height: 50px;
    background-color: white;
  }
  td {
    padding: 0.5rem;
    letter-spacing: 1px;
    font-size: 14px;
  }
  td:nth-child(1) {
    width: 25%;
  }
  td:nth-child(2) {
    width: 15%;
  }
  td:nth-child(3) {
    width: 22.5%;
  }
  td:nth-child(4) {
    width: 15%;
  }
  td:nth-child(5) {
    width: 22.5%;
  }
  th:nth-child(1) {
    width: 25%;
  }
  th:nth-child(2) {
    width: 15%;
  }
  th:nth-child(3) {
    width: 22.5%;
  }
  th:nth-child(4) {
    width: 15%;
  }
  th:nth-child(5) {
    width: 22.5%;
  }
`;
