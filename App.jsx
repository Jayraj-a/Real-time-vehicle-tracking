import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8001";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    loadVehicles();
    loadAlerts();
    loadLocations();

    const ws = new WebSocket("ws://127.0.0.1:8001/ws");

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("Location update:", event.data);

      const location = JSON.parse(event.data);

      setLocations((previous) => [
        location,
        ...previous,
      ]);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  async function loadVehicles() {
    try {
      const response = await axios.get(`${API}/vehicles/`);
      setVehicles(response.data);
    } catch (error) {
      console.error("Vehicle error:", error);
    }
  }

  async function loadAlerts() {
    try {
      const response = await axios.get(`${API}/alerts/`);
      setAlerts(response.data);
    } catch (error) {
      console.error("Alert error:", error);
    }
  }

  async function loadLocations() {
    try {
      const response = await axios.get(`${API}/locations/`);
      setLocations(response.data);
    } catch (error) {
      console.error("Location error:", error);
    }
  }

  return (
    <div className="dashboard">

      <header className="header">
        <div>
          <h1>Vehicle Tracking System</h1>
          <p>Real-time fleet monitoring dashboard</p>
        </div>

        <div className={connected ? "status online" : "status offline"}>
          ● {connected ? "Live Connected" : "Disconnected"}
        </div>
      </header>

      <main>

        <section className="cards">

          <div className="card">
            <h3>Total Vehicles</h3>
            <strong>{vehicles.length}</strong>
          </div>

          <div className="card">
            <h3>Active Vehicles</h3>
            <strong>
              {vehicles.filter((vehicle) => vehicle.is_active).length}
            </strong>
          </div>

          <div className="card">
            <h3>Total Alerts</h3>
            <strong>{alerts.length}</strong>
          </div>

          <div className="card">
            <h3>Live Locations</h3>
            <strong>{locations.length}</strong>
          </div>

        </section>

        <section className="panel">

          <h2>Vehicles</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle Number</th>
                <th>Type</th>
                <th>Driver</th>
                <th>Speed Limit</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.id}</td>
                  <td>{vehicle.vehicle_number}</td>
                  <td>{vehicle.vehicle_type}</td>
                  <td>{vehicle.driver_name}</td>
                  <td>{vehicle.speed_limit} km/h</td>
                  <td>
                    {vehicle.is_active ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </section>

        <section className="panel">

          <h2>Recent Alerts</h2>

          {alerts.length === 0 ? (
            <p>No alerts available.</p>
          ) : (
            alerts.map((alert) => (
              <div className="alert" key={alert.id}>

                <div>
                  <strong>{alert.alert_type}</strong>
                  <p>{alert.message}</p>
                </div>

                <span>
                  {alert.speed} km/h
                </span>

              </div>
            ))
          )}

        </section>

        <section className="panel">

          <h2>Live Location Updates</h2>

          {locations.length === 0 ? (
            <p>Waiting for location updates...</p>
          ) : (
            locations.slice(0, 10).map((location, index) => (
              <div className="location" key={index}>

                <strong>
                  Vehicle {location.vehicle_id}
                </strong>

                <span>
                  {location.latitude}, {location.longitude}
                </span>

                <span>
                  {location.speed} km/h
                </span>

              </div>
            ))
          )}

        </section>

      </main>

    </div>
  );
}

export default App;