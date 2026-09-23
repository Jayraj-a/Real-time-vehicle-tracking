import { useEffect, useState } from 'react'
import { getVehicles } from '../api/api'

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getVehicles()
      .then((response) => {
        setVehicles(response.data)
        setError('')
      })
      .catch((err) => {
        console.error('Vehicle API error:', err)
        setError('Unable to load vehicles.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <main className="dashboard">
      <div className="dashboard-top">
        <h1>Vehicles</h1>
        <p>Manage and monitor your fleet vehicles.</p>
      </div>

      <div className="active-card">
        <div className="card-header">
          <div>
            <h2>Fleet Vehicles</h2>
            <p>{vehicles.length} vehicle(s)</p>
          </div>
        </div>

        {loading && (
          <div style={{ padding: '20px' }}>
            Loading vehicles...
          </div>
        )}

        {error && (
          <div style={{ padding: '20px' }}>
            {error}
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div style={{ padding: '20px' }}>
            No vehicles found.
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
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
                    <td>
                      <strong>{vehicle.vehicle_number}</strong>
                    </td>
                    <td>{vehicle.vehicle_type}</td>
                    <td>{vehicle.driver_name}</td>
                    <td>{vehicle.speed_limit} km/h</td>
                    <td>
                      <span
                        className={`status-badge ${
                          vehicle.is_active ? 'moving' : 'offline'
                        }`}
                      >
                        {vehicle.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

export default Vehicles