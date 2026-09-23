from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db

from models.alert import Alert
from models.driver import Driver
from models.trip import Trip
from models.vehicle import Vehicle


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/fleet-summary")
def fleet_summary(
    db: Session = Depends(get_db),
):
    vehicles = db.query(Vehicle).all()

    trips = db.query(Trip).all()

    drivers = db.query(Driver).all()

    alerts = db.query(Alert).all()

    return {
        "vehicle_count": len(vehicles),
        "driver_count": len(drivers),
        "trip_count": len(trips),
        "alert_count": len(alerts),
        "vehicles": [
            {
                "id": vehicle.id,
                "vehicle_number":
                    vehicle.vehicle_number,
                "vehicle_type":
                    vehicle.vehicle_type,
                "driver_name":
                    vehicle.driver_name,
                "speed_limit":
                    vehicle.speed_limit,
                "is_active":
                    vehicle.is_active,
            }
            for vehicle in vehicles
        ],
    }