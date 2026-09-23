import { useEffect, useState } from 'react'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet'
import L from 'leaflet'

import {
  getVehicles,
  getLatestLocation,
} from '../api/api'

import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function LiveTracking() {
  const [locations, setLocations] = useState({})
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVehicleLocations = async () => {
      try {
        const response = await getVehicles()
        const vehicles = response.data

        for (const vehicle of vehicles) {
          try {
            const locationResponse =
              await getLatestLocation(vehicle.id)

            setLocations((current) => ({
              ...current,
              [vehicle.id]: {
                ...locationResponse.data,
                vehicle_id: vehicle.id,
                vehicle_number:
                  vehicle.vehicle_number,
              },
            }))
          } catch (error) {
            console.log(
              `No location available for vehicle ${vehicle.id}`,
              error
            )
          }
        }
      } catch (error) {
        console.error(
          'Unable to load vehicles:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadVehicleLocations()

    const socket = new WebSocket(
      'ws://127.0.0.1:8001/ws'
    )

    socket.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'location') {
          setLocations((current) => ({
            ...current,
            [data.vehicle_id]: {
              ...current[data.vehicle_id],
              ...data,
            },
          }))
        }
      } catch (error) {
        console.error(
          'Invalid WebSocket message:',
          error
        )
      }
    }

    socket.onerror = (error) => {
      console.error(
        'WebSocket error:',
        error
      )
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    }

    return () => {
      socket.close()
    }
  }, [])

  const vehicleLocations =
    Object.values(locations)

  return (
    <main className="dashboard">
      <div className="dashboard-top">
        <h1>Live Tracking</h1>

        <p>
          Real-time vehicle locations and movement.
        </p>
      </div>

      <div className="map-card">
        <div className="card-header">
          <div>
            <h2>
              <span className="live-dot"></span>
              Live Vehicle Tracking
            </h2>

            <p>
              WebSocket:{' '}
              {connected
                ? 'Connected'
                : 'Disconnected'}
            </p>
          </div>
        </div>

        {loading && (
          <div
            style={{
              padding: '20px',
              color: '#7b8493',
            }}
          >
            Loading vehicle locations...
          </div>
        )}

        <div style={{ height: '520px' }}>
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

            {vehicleLocations.map(
              (location) => {
                const latitude =
                  Number(location.latitude)

                const longitude =
                  Number(location.longitude)

                if (
                  Number.isNaN(latitude) ||
                  Number.isNaN(longitude)
                ) {
                  return null
                }

                return (
                  <Marker
                    key={location.vehicle_id}
                    position={[
                      latitude,
                      longitude,
                    ]}
                  >
                    <Popup>
                      <strong>
                        {location.vehicle_number ||
                          `Vehicle ${location.vehicle_id}`}
                      </strong>

                      <br />

                      Speed:{' '}
                      {location.speed ?? 0} km/h

                      <br />

                      Latitude: {latitude}

                      <br />

                      Longitude: {longitude}

                      {location.heading != null && (
                        <>
                          <br />
                          Heading:{' '}
                          {location.heading}°
                        </>
                      )}
                    </Popup>
                  </Marker>
                )
              }
            )}
          </MapContainer>
        </div>
      </div>
    </main>
  )
}

export default LiveTracking