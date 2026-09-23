from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.connection import get_db

from models.alert import Alert
from models.location import Location
from models.trip import Trip
from models.vehicle import Vehicle


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/summary")
def analytics_summary(
    db: Session = Depends(get_db),
):
    total_vehicles = db.query(Vehicle).count()

    active_vehicles = (
        db.query(Vehicle)
        .filter(Vehicle.is_active == True)
        .count()
    )

    total_alerts = db.query(Alert).count()

    total_trips = db.query(Trip).count()

    completed_trips = (
        db.query(Trip)
        .filter(Trip.status == "completed")
        .count()
    )

    avg_speed = (
        db.query(func.avg(Location.speed))
        .scalar()
        or 0
    )

    max_speed = (
        db.query(func.max(Location.speed))
        .scalar()
        or 0
    )

    total_distance = (
        db.query(
            func.sum(Trip.distance_km)
        )
        .scalar()
        or 0
    )

    return {
        "total_vehicles": total_vehicles,
        "active_vehicles": active_vehicles,
        "total_alerts": total_alerts,
        "total_trips": total_trips,
        "completed_trips": completed_trips,
        "average_speed": round(
            float(avg_speed),
            2,
        ),
        "max_speed": round(
            float(max_speed),
            2,
        ),
        "total_distance_km": round(
            float(total_distance),
            2,
        ),
    }