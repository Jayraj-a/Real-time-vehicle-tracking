import { useEffect, useState } from 'react'
import {
  Circle,
  MapContainer,
  Popup,
  TileLayer,
} from 'react-leaflet'

import { getGeofences } from '../api/api'

function Geofencing() {
  const [geofences, setGeofences] =
    useState([])
  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    getGeofences()
      .then((response) => {
        setGeofences(response.data)
      })
      .catch((error) => {
        console.error(
          'Geofence API error:',
          error
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <main className="dashboard">
      <div className="dashboard-top">
        <h1>Geofencing</h1>
        <p>
          Monitor vehicles inside configured zones.
        </p>
      </div>

      <div className="map-card">
        <div className="card-header">
          <div>
            <h2>Geofence Map</h2>
            <p>
              {geofences.length} zone(s)
            </p>
          </div>
        </div>

        {loading && (
          <div className="page-message">
            Loading geofences...
          </div>
        )}

        <div className="real-map">
          <MapContainer
            center={[17.6868, 83.2185]}
            zoom={12}
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {geofences.map((geofence) => {
              const latitude =
                Number(geofence.latitude)

              const longitude =
                Number(geofence.longitude)

              const radius =
                Number(geofence.radius)

              if (
                Number.isNaN(latitude) ||
                Number.isNaN(longitude) ||
                Number.isNaN(radius)
              ) {
                return null
              }

              return (
                <Circle
                  key={geofence.id}
                  center={[
                    latitude,
                    longitude,
                  ]}
                  radius={radius}
                >
                  <Popup>
                    <strong>
                      {geofence.name}
                    </strong>

                    <br />

                    Radius: {radius} meters

                    <br />

                    Status:{' '}
                    {geofence.is_active
                      ? 'Active'
                      : 'Inactive'}
                  </Popup>
                </Circle>
              )
            })}
          </MapContainer>
        </div>
      </div>
    </main>
  )
}

export default Geofencing