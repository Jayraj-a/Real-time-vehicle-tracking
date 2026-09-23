import { useState } from 'react'

import Sidebar from './pages/Sidebar'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import LiveTracking from './pages/LiveTracking'
import Drivers from "./pages/Drivers";
import TripHistory from './pages/triphistory'

import './App.css'

function App() {
  const [activePage, setActivePage] =
    useState('Dashboard')

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Dashboard */}
      {activePage === 'Dashboard' && (
        <Dashboard />
      )}

      {/* Live Tracking */}
      {activePage === 'Live Tracking' && (
        <LiveTracking />
      )}

      {/* Vehicles */}
      {activePage === 'Vehicles' && (
        <Vehicles />
      )}

      {/* Trip History */}
      {activePage === 'Trip History' && (
        <TripHistory />
      )}

      {/* Drivers */}
      {activePage === 'Drivers' && (
        <Drivers />
      )}

      {/* Pages that are not implemented yet */}
      {activePage !== 'Dashboard' &&
        activePage !== 'Live Tracking' &&
        activePage !== 'Vehicles' &&
        activePage !== 'Trip History' &&
        activePage !== 'Drivers' && (
          <main className="dashboard">
            <div className="dashboard-top">
              <h1>{activePage}</h1>

              <p>
                TrackNow {activePage}
              </p>
            </div>
          </main>
        )}
    </div>
  )
}

export default App