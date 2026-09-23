import axios from "axios";

// ==============================
// API CONFIGURATION
// ==============================

const API_BASE_URL = "http://127.0.0.1:8001";

export const WS_URL = "ws://127.0.0.1:8001/ws";

const api = axios.create({
  baseURL: API_BASE_URL,
});


// ==============================
// VEHICLES
// ==============================

export const getVehicles = () =>
  api.get("/vehicles/");


// ==============================
// ALERTS
// ==============================

export const getAlerts = () =>
  api.get("/alerts/");


// ==============================
// GEOFENCES
// ==============================

export const getGeofences = () =>
  api.get("/geofences/");


// ==============================
// VEHICLE LOCATIONS
// ==============================

export const getLatestLocation = (vehicleId) =>
  api.get(
    `/locations/vehicles/${vehicleId}/latest-location`
  );

export const getVehicleLocations = (vehicleId) =>
  api.get(
    `/locations/vehicles/${vehicleId}/locations`
  );


// ==============================
// DRIVERS
// ==============================

export const getDrivers = () =>
  api.get("/drivers/");

export const createDriver = (data) =>
  api.post("/drivers/", data);

export const updateDriver = (id, data) =>
  api.put(`/drivers/${id}`, data);

export const deleteDriver = (id) =>
  api.delete(`/drivers/${id}`);


// ==============================
// TRIPS
// ==============================

export const getTrips = () =>
  api.get("/trips/");

export const createTrip = (data) =>
  api.post("/trips/", data);

export const completeTrip = (id) =>
  api.put(`/trips/${id}/complete`);

export const deleteTrip = (id) =>
  api.delete(`/trips/${id}`);


// ==============================
// DEFAULT API EXPORT
// ==============================

export default api;