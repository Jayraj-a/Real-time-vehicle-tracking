from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from models.vehicle import Vehicle
from schemas.vehicle import VehicleCreate, VehicleResponse

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)


@router.post("/", response_model=VehicleResponse)
def create_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db)
):
    existing_vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.vehicle_number == vehicle_data.vehicle_number)
        .first()
    )

    if existing_vehicle:
        raise HTTPException(
            status_code=400,
            detail="Vehicle already exists"
        )

    vehicle = Vehicle(
        vehicle_number=vehicle_data.vehicle_number,
        vehicle_type=vehicle_data.vehicle_type,
        driver_name=vehicle_data.driver_name,
        speed_limit=vehicle_data.speed_limit
    )

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return vehicle


@router.get("/", response_model=list[VehicleResponse])
def get_vehicles(
    db: Session = Depends(get_db)
):
    return db.query(Vehicle).all()


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    return vehicle