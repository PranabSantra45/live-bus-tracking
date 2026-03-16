import React, { useState } from "react";
import BusTable from "../components/BusTable";
import MapView from "../components/MapView";
import "../styles/dashboard.css";

function Dashboard() {

  const [selectedBus, setSelectedBus] = useState(null);

  return (
    <div className="dashboard">

      <div className="dashboard-content">

        <h1>Smart Bus Tracker Dashboard</h1>

        <div className="main-section">

          <div className="table-section">
            <h2>Bus Status</h2>
            <BusTable onBusSelect={setSelectedBus} />
          </div>

          <div className="map-section">
            <h2>Live Bus Map</h2>
            <MapView selectedBus={selectedBus} />
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;