from fastapi import FastAPI
from routes.driver import router as driver_router
from fastapi.middleware.cors import CORSMiddleware

from routes.vehicle import router as vehicle_router
from routes.location import router as location_router
from routes.websocket import router as websocket_router
from routes.alert import router as alert_router
from routes.geofence import router as geofence_router

from routes.driver import router as driver_router
from routes.trip import router as trip_router
from routes.analytics import router as analytics_router
from routes.report import router as report_router
from routes.setting import router as setting_router


app = FastAPI(
    title="Vehicle Tracking API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message":
            "Vehicle Tracking API is running"
    }


app.include_router(vehicle_router)
app.include_router(location_router)
app.include_router(websocket_router)
app.include_router(alert_router)
app.include_router(geofence_router)

app.include_router(driver_router)
app.include_router(trip_router)
app.include_router(analytics_router)
app.include_router(report_router)
app.include_router(driver_router)
app.include_router(setting_router)