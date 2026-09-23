from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from models.location import Location
from models.vehicle import Vehicle
from schemas.location import LocationCreate, LocationResponse

from routes.websocket import manager

from services.alert_service import check_overspeed
from services.geofence_service import check_geofences


router = APIRouter(
    prefix="/locations",
    tags=["Locations"]
)


@router.post("/", response_model=LocationResponse)
async def create_location(
    location_data: LocationCreate,
    db: Session = Depends(get_db)
):
    # Check whether vehicle exists
    vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.id == location_data.vehicle_id)
        .first()
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    # Create location
    location = Location(
        vehicle_id=location_data.vehicle_id,
        latitude=location_data.latitude,
        longitude=location_data.longitude,
        speed=location_data.speed,
        heading=location_data.heading
    )

    # Save location
    db.add(location)
    db.commit()
    db.refresh(location)

    # Check overspeed
    overspeed_alert = check_overspeed(
        db,
        vehicle,
        location.speed
    )

    # Check geofence
    geofence_alerts = check_geofences(
        db,
        vehicle.id,
        location.latitude,
        location.longitude
    )

    # Broadcast location
    await manager.broadcast({
        "type": "location",
        "vehicle_id": location.vehicle_id,
        "latitude": location.latitude,
        "longitude": location.longitude,
        "speed": location.speed,
        "heading": location.heading,
        "timestamp": location.timestamp.isoformat()
    })

    # Broadcast overspeed alert
    if overspeed_alert:
        await manager.broadcast({
            "type": "alert",
            "alert_type": overspeed_alert.alert_type,
            "vehicle_id": overspeed_alert.vehicle_id,
            "message": overspeed_alert.message,
            "speed": overspeed_alert.speed
        })

    # Broadcast geofence alerts
    for geofence_alert in geofence_alerts:
        await manager.broadcast({
            "type": "alert",
            "alert_type": geofence_alert.alert_type,
            "vehicle_id": geofence_alert.vehicle_id,
            "message": geofence_alert.message,
            "speed": geofence_alert.speed
        })

    return location


@router.get(
    "/vehicles/{vehicle_id}/locations",
    response_model=list[LocationResponse]
)
def get_vehicle_locations(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    locations = (
        db.query(Location)
        .filter(Location.vehicle_id == vehicle_id)
        .order_by(Location.timestamp.desc())
        .all()
    )

    return locations


@router.get(
    "/vehicles/{vehicle_id}/latest-location",
    response_model=LocationResponse
)
def get_latest_location(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    location = (
        db.query(Location)
        .filter(Location.vehicle_id == vehicle_id)
        .order_by(Location.timestamp.desc())
        .first()
    )

    if not location:
        raise HTTPException(
            status_code=404,
            detail="No location found for this vehicle"
        )

    return location