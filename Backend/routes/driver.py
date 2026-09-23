from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database.connection import get_db
from models.driver import Driver
from schemas.driver import DriverCreate, DriverResponse


router = APIRouter(
    prefix="/drivers",
    tags=["Drivers"]
)


@router.get(
    "/",
    response_model=list[DriverResponse]
)
def get_drivers(
    db: Session = Depends(get_db)
):
    return (
        db.query(Driver)
        .order_by(Driver.id.asc())
        .all()
    )


@router.get(
    "/{driver_id}",
    response_model=DriverResponse
)
def get_driver(
    driver_id: int,
    db: Session = Depends(get_db)
):
    driver = (
        db.query(Driver)
        .filter(Driver.id == driver_id)
        .first()
    )

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    return driver


@router.post(
    "/",
    response_model=DriverResponse,
    status_code=201
)
def create_driver(
    driver: DriverCreate,
    db: Session = Depends(get_db)
):
    new_driver = Driver(
        name=driver.name,
        phone=driver.phone,
        license_number=driver.license_number,
        vehicle_id=driver.vehicle_id,
        is_active=driver.is_active
    )

    try:
        db.add(new_driver)
        db.commit()
        db.refresh(new_driver)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="License number already exists"
        )

    return new_driver


@router.put(
    "/{driver_id}",
    response_model=DriverResponse
)
def update_driver(
    driver_id: int,
    driver_data: DriverCreate,
    db: Session = Depends(get_db)
):
    driver = (
        db.query(Driver)
        .filter(Driver.id == driver_id)
        .first()
    )

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    driver.name = driver_data.name
    driver.phone = driver_data.phone
    driver.license_number = driver_data.license_number
    driver.vehicle_id = driver_data.vehicle_id
    driver.is_active = driver_data.is_active

    try:
        db.commit()
        db.refresh(driver)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="License number already exists"
        )

    return driver


@router.delete("/{driver_id}")
def delete_driver(
    driver_id: int,
    db: Session = Depends(get_db)
):
    driver = (
        db.query(Driver)
        .filter(Driver.id == driver_id)
        .first()
    )

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    db.delete(driver)
    db.commit()

    return {
        "message": "Driver deleted successfully"
    }