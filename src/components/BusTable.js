import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function BusTable({ onBusSelect }) {

  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "buses"),
      (snapshot) => {

        const busData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBuses(busData);

      }
    );

    return () => unsubscribe();

  }, []);

  const filteredBuses = buses.filter(bus =>
    bus.displayCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ overflowX: "auto" }}>

      <input
        placeholder="Search bus route..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
          style={{
          marginBottom:"12px",
          padding:"10px",
          width:"90%",
          fontSize:"14px"
          }}
      />

      <table className="bus-table">

        <thead>
          <tr>
            <th>Route</th>
            <th>Bus Number</th>
            <th>Status</th>
            <th>Speed</th>
          </tr>
        </thead>

        <tbody>

          {filteredBuses.map((bus) => (

            <tr
              key={bus.id}
              onClick={() => onBusSelect(bus)}
              style={{ cursor: "pointer" }}
            >
              <td>{bus.displayCode}</td>
              <td>{bus.busnumber}</td>
              <td>{bus.status}</td>
              <td>{bus.currentlocation?.speed || 0} km/h</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default BusTable;