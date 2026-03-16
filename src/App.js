import "./App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="app-container">

      <header className="navbar">
        <h2>Sathyabama - Smart Bus Tracker</h2>
        <div className="profile">Pranab Kumar Santra</div>
      </header>

      <div className="main-layout">
        <Dashboard />
      </div>

    </div>
  );
}

export default App;