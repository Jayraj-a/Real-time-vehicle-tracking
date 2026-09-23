import { useEffect, useState } from 'react'

import {
  completeTrip,
  createTrip,
  deleteTrip,
  getTrips,
} from '../api/api'

function TripHistory() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    vehicle_id: '',
    driver_id: '',
    start_location: '',
    end_location: '',
    distance: '',
  })

  const loadTrips = async () => {
    try {
      const response = await getTrips()

      setTrips(response.data)
      setError('')
    } catch (error) {
      console.error(
        'Trip API error:',
        error
      )

      setError(
        'Unable to load trips.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrips()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setError('')
      setMessage('')

      await createTrip({
        vehicle_id: Number(
          form.vehicle_id
        ),

        driver_id: form.driver_id
          ? Number(form.driver_id)
          : null,

        start_location:
          form.start_location || null,

        end_location:
          form.end_location || null,

        distance: form.distance
          ? Number(form.distance)
          : 0,

        status: 'ongoing',
      })

      setForm({
        vehicle_id: '',
        driver_id: '',
        start_location: '',
        end_location: '',
        distance: '',
      })

      setMessage(
        'Trip created successfully.'
      )

      await loadTrips()
    } catch (error) {
      console.error(error)

      setError(
        'Unable to create trip.'
      )
    }
  }

  const handleComplete = async (
    tripId
  ) => {
    try {
      await completeTrip(tripId)

      setMessage(
        'Trip completed successfully.'
      )

      await loadTrips()
    } catch (error) {
      console.error(error)

      setError(
        'Unable to complete trip.'
      )
    }
  }

  const handleDelete = async (
    tripId
  ) => {
    const confirmed =
      window.confirm(
        'Delete this trip?'
      )

    if (!confirmed) {
      return
    }

    try {
      await deleteTrip(tripId)

      setMessage(
        'Trip deleted successfully.'
      )

      await loadTrips()
    } catch (error) {
      console.error(error)

      setError(
        'Unable to delete trip.'
      )
    }
  }

  return (
    <main className="dashboard">
      <div className="dashboard-top">
        <h1>Trip History</h1>

        <p>
          View and manage fleet trips.
        </p>
      </div>

      <div className="form-card">
        <div className="card-header">
          <div>
            <h2>Create Trip</h2>

            <p>
              Register a new vehicle
              journey.
            </p>
          </div>
        </div>

        <form
          className="trip-form"
          onSubmit={handleSubmit}
        >
          <input
            type="number"
            name="vehicle_id"
            placeholder="Vehicle ID"
            value={form.vehicle_id}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="driver_id"
            placeholder="Driver ID"
            value={form.driver_id}
            onChange={handleChange}
          />

          <input
            type="text"
            name="start_location"
            placeholder="Start location"
            value={
              form.start_location
            }
            onChange={handleChange}
          />

          <input
            type="text"
            name="end_location"
            placeholder="End location"
            value={
              form.end_location
            }
            onChange={handleChange}
          />

          <input
            type="number"
            step="0.1"
            name="distance"
            placeholder="Distance (km)"
            value={form.distance}
            onChange={handleChange}
          />

          <button type="submit">
            Create Trip
          </button>
        </form>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      <div className="active-card trip-list-card">
        <div className="card-header">
          <div>
            <h2>Trip History</h2>

            <p>
              {trips.length} trip(s)
            </p>
          </div>
        </div>

        {loading && (
          <div className="page-message">
            Loading trips...
          </div>
        )}

        {!loading &&
          trips.length === 0 && (
            <div className="page-message">
              No trips found.
            </div>
          )}

        {!loading &&
          trips.length > 0 && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Start</th>
                    <th>Destination</th>
                    <th>Distance</th>
                    <th>Status</th>
                    <th>Started</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td>
                        {trip.id}
                      </td>

                      <td>
                        {trip.vehicle_id}
                      </td>

                      <td>
                        {trip.driver_id ??
                          '-'}
                      </td>

                      <td>
                        {trip.start_location ||
                          '-'}
                      </td>

                      <td>
                        {trip.end_location ||
                          '-'}
                      </td>

                      <td>
                        {trip.distance} km
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            trip.status ===
                            'completed'
                              ? 'moving'
                              : 'idle'
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          trip.start_time
                        ).toLocaleString()}
                      </td>

                      <td>
                        <div className="table-actions">
                          {trip.status !==
                            'completed' && (
                            <button
                              type="button"
                              className="complete-button"
                              onClick={() =>
                                handleComplete(
                                  trip.id
                                )
                              }
                            >
                              Complete
                            </button>
                          )}

                          <button
                            type="button"
                            className="danger-button"
                            onClick={() =>
                              handleDelete(
                                trip.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
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

export default TripHistory