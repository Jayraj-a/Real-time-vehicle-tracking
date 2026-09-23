import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet'

import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'


// ==============================
// FIX LEAFLET DEFAULT MARKER ICON
// ==============================

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})


// ==============================
// DASHBOARD STATS
// ==============================

const stats = [
  {
    title: 'Total Vehicles',
    value: 24,
    note: '↑ 8% this month',
    icon: '🚙',
    color: 'blue',
  },
  {
    title: 'Moving',
    value: 16,
    note: '66.7% of total',
    icon: '🚗',
    color: 'green',
  },
  {
    title: 'Idle',
    value: 5,
    note: '20.8% of total',
    icon: 'Ⅱ',
    color: 'orange',
  },
  {
    title: 'Offline',
    value: 3,
    note: '12.5% of total',
    icon: '📡',
    color: 'red',
  },
]


// ==============================
// ACTIVE VEHICLES
// ==============================

const vehicles = [
  {
    number: 'AP31AB1234',
    driver: 'Rahul Kumar',
    speed: '52 km/h',
    status: 'Moving',
  },
  {
    number: 'AP31CD4567',
    driver: 'Arjun Singh',
    speed: '36 km/h',
    status: 'Moving',
  },
  {
    number: 'AP31EF7890',
    driver: 'Kiran Rao',
    speed: '0 km/h',
    status: 'Idle',
  },
  {
    number: 'AP31GH1111',
    driver: 'Ravi Teja',
    speed: 'Offline',
    status: 'Offline',
  },
]


// ==============================
// SAMPLE MAP VEHICLE LOCATIONS
// ==============================

const mapVehicles = [
  {
    id: 1,
    number: 'AP31AB1234',
    driver: 'Rahul Kumar',
    speed: 52,
    latitude: 17.6868,
    longitude: 83.2185,
  },
  {
    id: 2,
    number: 'AP31CD4567',
    driver: 'Arjun Singh',
    speed: 36,
    latitude: 17.7005,
    longitude: 83.2315,
  },
  {
    id: 3,
    number: 'AP31EF7890',
    driver: 'Kiran Rao',
    speed: 0,
    latitude: 17.6765,
    longitude: 83.2048,
  },
]


function Dashboard() {
  return (
    <main className="dashboard">

      {/* =========================
          DASHBOARD HEADER
      ========================= */}

      <div className="dashboard-top">
        <div>
          <h1>Dashboard</h1>

          <p>
            Here's what's happening with your fleet today.
          </p>
        </div>
      </div>


      {/* =========================
          STATISTIC CARDS
      ========================= */}

      <section className="stats-grid">
        {stats.map((stat) => (
          <article
            key={stat.title}
            className={`stat-card ${stat.color}`}
          >
            <div className="stat-left">
              <span className="stat-title">
                {stat.title}
              </span>

              <strong>
                {stat.value}
              </strong>

              <small>
                {stat.note}
              </small>
            </div>

            <div className="stat-icon">
              {stat.icon}
            </div>
          </article>
        ))}
      </section>


      {/* =========================
          LOWER DASHBOARD
      ========================= */}

      <section className="dashboard-grid">

        {/* =========================
            REAL MAP CARD
        ========================= */}

        <div className="map-card">

          <div className="card-header">
            <div>
              <h2>
                <span className="live-dot"></span>
                Live Vehicle Tracking
              </h2>

              <p>
                Real-time vehicle locations
              </p>
            </div>

            <button type="button">
              View Full Map ↗
            </button>
          </div>


          <div className="real-dashboard-map">

            <MapContainer
              center={[17.6868, 83.2185]}
              zoom={13}
              scrollWheelZoom={true}
              style={{
                height: '100%',
                width: '100%',
              }}
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              {mapVehicles.map((vehicle) => (
                <Marker
                  key={vehicle.id}
                  position={[
                    vehicle.latitude,
                    vehicle.longitude,
                  ]}
                >
                  <Popup>
                    <strong>
                      {vehicle.number}
                    </strong>

                    <br />

                    Driver: {vehicle.driver}

                    <br />

                    Speed: {vehicle.speed} km/h
                  </Popup>
                </Marker>
              ))}

            </MapContainer>

          </div>

        </div>


        {/* =========================
            ACTIVE VEHICLES
        ========================= */}

        <div className="active-card">

          <div className="card-header">
            <div>
              <h2>
                Active Vehicles
              </h2>

              <p>
                {vehicles.length} Active
              </p>
            </div>

            <button type="button">
              View All
            </button>
          </div>


          <div className="vehicle-list">

            {vehicles.map((vehicle) => (
              <div
                className="vehicle-row"
                key={vehicle.number}
              >

                <div className="vehicle-image">
                  🚙
                </div>


                <div className="vehicle-info">
                  <strong>
                    {vehicle.number}
                  </strong>

                  <span>
                    {vehicle.driver}
                  </span>
                </div>


                <div className="vehicle-right">

                  <span>
                    {vehicle.speed}
                  </span>

                  <span
                    className={`status-badge ${vehicle.status.toLowerCase()}`}
                  >
                    {vehicle.status}
                  </span>

                </div>

              </div>
            ))}

          </div>


          <button
            type="button"
            className="all-vehicles-button"
          >
            View All Vehicles →
          </button>

        </div>

      </section>

    </main>
  )
}

export default Dashboard