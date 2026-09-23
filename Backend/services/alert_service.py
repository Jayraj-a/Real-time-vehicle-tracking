from sqlalchemy.orm import Session

from models.alert import Alert
from models.vehicle import Vehicle


def check_overspeed(
    db: Session,
    vehicle: Vehicle,
    speed: float
):
    if speed <= vehicle.speed_limit:
        return None

    alert = Alert(
        vehicle_id=vehicle.id,
        alert_type="OVERSPEED",
        message=(
            f"Vehicle exceeded speed limit "
            f"of {vehicle.speed_limit} km/h"
        ),
        speed=speed,
        is_resolved=False
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert