import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
  iconSize: [32, 32]
});


function FlyToBus({ bus }) {

  const map = useMap();

  useEffect(() => {

    if (bus?.currentlocation) {

      map.flyTo(
        [bus.currentlocation.lat, bus.currentlocation.lng],
        16
      );

    }

  }, [bus, map]);

  return null;
}


function getDistance(lat1, lon1, lat2, lon2) {

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}


function calculateETA(distance, speed) {

  if (!speed) return "Unknown";

  const hours = distance / speed;

  const minutes = Math.round(hours * 60);

  return minutes + " mins";
}


function MapView({ selectedBus }) {

  const [buses, setBuses] = useState([]);
  const [studentLocation, setStudentLocation] = useState(null);

  useEffect(() => {

    navigator.geolocation.watchPosition((position) => {

      setStudentLocation([
        position.coords.latitude,
        position.coords.longitude
      ]);

    });

  }, []);


  useEffect(() => {

    const q = query(
      collection(db, "buses"),
      where("status", "==", "active")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const busData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setBuses(busData);

    });

    return () => unsubscribe();

  }, []);


  return (

    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={13}
      style={{ height: "60vh", width: "100%" }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedBus && <FlyToBus bus={selectedBus} />}

      {studentLocation && (
        <CircleMarker
          center={studentLocation}
          radius={8}
          pathOptions={{ color: "blue" }}
        >
          <Popup>Your Location</Popup>
        </CircleMarker>
      )}

      {buses.map(bus => (

        bus.currentlocation && (

          <Marker
            key={bus.id}
            position={[
              bus.currentlocation.lat,
              bus.currentlocation.lng
            ]}
            icon={busIcon}
          >

            <Popup>

              Route: {bus.displayCode}
              <br />

              Bus: {bus.busnumber}
              <br />

              Speed: {bus.currentlocation?.speed || 0} km/h
              <br />

              ETA: {

                studentLocation
                  ? calculateETA(

                      getDistance(
                        studentLocation[0],
                        studentLocation[1],
                        bus.currentlocation.lat,
                        bus.currentlocation.lng
                      ),

                      bus.currentlocation.speed

                    )
                  : "Calculating..."

              }

            </Popup>

          </Marker>

        )

      ))}

    </MapContainer>

  );
}

export default MapView;