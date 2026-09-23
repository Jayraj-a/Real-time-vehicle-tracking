from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from models.trip import Trip
from schemas.trip import TripCreate, TripResponse


router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)


@router.get(
    "/",
    response_model=list[TripResponse]
)
def get_trips(
    db: Session = Depends(get_db)
):
    return (
        db.query(Trip)
        .order_by(Trip.id.desc())
        .all()
    )


@router.get(
    "/{trip_id}",
    response_model=TripResponse
)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db)
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == trip_id)
        .first()
    )

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    return trip


@router.post(
    "/",
    response_model=TripResponse,
    status_code=201
)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db)
):
    new_trip = Trip(
        vehicle_id=trip.vehicle_id,
        driver_id=trip.driver_id,
        start_location=trip.start_location,
        end_location=trip.end_location,
        distance=trip.distance,
        status=trip.status
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return new_trip


@router.put(
    "/{trip_id}/complete",
    response_model=TripResponse
)
def complete_trip(
    trip_id: int,
    db: Session = Depends(get_db)
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == trip_id)
        .first()
    )

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    trip.status = "completed"
    trip.end_time = datetime.utcnow()

    db.commit()
    db.refresh(trip)

    return trip


@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db)
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == trip_id)
        .first()
    )

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    db.delete(trip)
    db.commit()

    return {
        "message": "Trip deleted successfully"
    }