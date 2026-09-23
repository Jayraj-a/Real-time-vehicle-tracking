import { useEffect, useState } from 'react'

import {
  createDriver,
  deleteDriver,
  getDrivers,
} from '../api/api'

function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    license_number: '',
    vehicle_id: '',
  })

  const loadDrivers = async () => {
    try {
      const response = await getDrivers()

      setDrivers(response.data)
      setError('')
    } catch (error) {
      console.error(
        'Driver API error:',
        error
      )

      setError(
        'Unable to load drivers.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDrivers()
  }, [])

  const handleChange = (event) => {
    const { name, value } =
      event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault()

    try {
      setMessage('')
      setError('')

      await createDriver({
        name: form.name,
        phone:
          form.phone || null,

        license_number:
          form.license_number,

        vehicle_id:
          form.vehicle_id
            ? Number(form.vehicle_id)
            : null,

        is_active: true,
      })

      setForm({
        name: '',
        phone: '',
        license_number: '',
        vehicle_id: '',
      })

      setMessage(
        'Driver added successfully.'
      )

      await loadDrivers()
    } catch (error) {
      console.error(
        'Unable to create driver:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to add driver.'
      )
    }
  }

  const handleDelete = async (
    driverId
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this driver?'
      )

    if (!confirmed) {
      return
    }

    try {
      await deleteDriver(driverId)

      setMessage(
        'Driver deleted successfully.'
      )

      setError('')

      await loadDrivers()
    } catch (error) {
      console.error(
        'Unable to delete driver:',
        error
      )

      setError(
        'Unable to delete driver.'
      )
    }
  }

  return (
    <main className="dashboard">
      <div className="dashboard-top">
        <h1>Drivers</h1>

        <p>
          Manage drivers assigned to
          your fleet.
        </p>
      </div>

      <div className="form-card">
        <div className="card-header driver-card-header">
          <div>
            <h2>Add Driver</h2>

            <p>
              Register a new fleet
              driver.
            </p>
          </div>
        </div>

        <form
          className="driver-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Driver name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="license_number"
            placeholder="License number"
            value={
              form.license_number
            }
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="vehicle_id"
            placeholder="Vehicle ID"
            min="1"
            value={form.vehicle_id}
            onChange={handleChange}
          />

          <button type="submit">
            Add Driver
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

      <div className="active-card driver-list-card">
        <div className="card-header">
          <div>
            <h2>Fleet Drivers</h2>

            <p>
              {drivers.length}{' '}
              driver(s)
            </p>
          </div>
        </div>

        {loading && (
          <div className="page-message">
            Loading drivers...
          </div>
        )}

        {!loading &&
          !error &&
          drivers.length === 0 && (
            <div className="page-message">
              No drivers found.
            </div>
          )}

        {!loading &&
          drivers.length > 0 && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>License</th>
                    <th>
                      Vehicle ID
                    </th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {drivers.map(
                    (driver) => (
                      <tr
                        key={
                          driver.id
                        }
                      >
                        <td>
                          {
                            driver.id
                          }
                        </td>

                        <td>
                          <strong>
                            {
                              driver.name
                            }
                          </strong>
                        </td>

                        <td>
                          {driver.phone ||
                            '-'}
                        </td>

                        <td>
                          {
                            driver.license_number
                          }
                        </td>

                        <td>
                          {driver.vehicle_id ??
                            'Not assigned'}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${
                              driver.is_active
                                ? 'moving'
                                : 'offline'
                            }`}
                          >
                            {driver.is_active
                              ? 'Active'
                              : 'Inactive'}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() =>
                              handleDelete(
                                driver.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </main>
  )
}

export default Drivers