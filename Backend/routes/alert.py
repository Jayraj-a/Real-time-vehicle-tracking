from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from models.alert import Alert
from schemas.alert import AlertResponse


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


@router.get("/", response_model=list[AlertResponse])
def get_all_alerts(
    db: Session = Depends(get_db)
):
    alerts = (
        db.query(Alert)
        .order_by(Alert.created_at.desc())
        .all()
    )

    return alerts


@router.get(
    "/vehicle/{vehicle_id}",
    response_model=list[AlertResponse]
)
def get_vehicle_alerts(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    alerts = (
        db.query(Alert)
        .filter(Alert.vehicle_id == vehicle_id)
        .order_by(Alert.created_at.desc())
        .all()
    )

    return alerts


@router.get(
    "/unresolved",
    response_model=list[AlertResponse]
)
def get_unresolved_alerts(
    db: Session = Depends(get_db)
):
    alerts = (
        db.query(Alert)
        .filter(Alert.is_resolved == False)
        .order_by(Alert.created_at.desc())
        .all()
    )

    return alerts


@router.put(
    "/{alert_id}/resolve",
    response_model=AlertResponse
)
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id)
        .first()
    )

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    alert.is_resolved = True

    db.commit()
    db.refresh(alert)

    return alert