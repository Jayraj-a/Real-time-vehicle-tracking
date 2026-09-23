from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from models.geofence import Geofence
from schemas.geofence import GeofenceCreate, GeofenceResponse


router = APIRouter(
    prefix="/geofences",
    tags=["Geofences"]
)


@router.post(
    "/",
    response_model=GeofenceResponse
)
def create_geofence(
    geofence_data: GeofenceCreate,
    db: Session = Depends(get_db)
):
    geofence = Geofence(
        name=geofence_data.name,
        latitude=geofence_data.latitude,
        longitude=geofence_data.longitude,
        radius=geofence_data.radius,
        is_active=geofence_data.is_active
    )

    db.add(geofence)
    db.commit()
    db.refresh(geofence)

    return geofence


@router.get(
    "/",
    response_model=list[GeofenceResponse]
)
def get_geofences(
    db: Session = Depends(get_db)
):
    return (
        db.query(Geofence)
        .order_by(Geofence.id.desc())
        .all()
    )


@router.get(
    "/{geofence_id}",
    response_model=GeofenceResponse
)
def get_geofence(
    geofence_id: int,
    db: Session = Depends(get_db)
):
    geofence = (
        db.query(Geofence)
        .filter(Geofence.id == geofence_id)
        .first()
    )

    if not geofence:
        raise HTTPException(
            status_code=404,
            detail="Geofence not found"
        )

    return geofence