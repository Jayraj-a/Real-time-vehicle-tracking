import math

from sqlalchemy.orm import Session

from models.geofence import Geofence
from models.alert import Alert


def calculate_distance(
    latitude1: float,
    longitude1: float,
    latitude2: float,
    longitude2: float
) -> float:
    """
    Calculate distance between two GPS coordinates
    using the Haversine formula.

    Returns distance in meters.
    """

    earth_radius = 6371000

    lat1 = math.radians(latitude1)
    lat2 = math.radians(latitude2)

    delta_lat = math.radians(latitude2 - latitude1)
    delta_lon = math.radians(longitude2 - longitude1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(delta_lon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return earth_radius * c


def check_geofences(
    db: Session,
    vehicle_id: int,
    latitude: float,
    longitude: float
):
    """
    Check active geofences.

    Creates one active GEOFENCE alert when a vehicle
    leaves a geofence.

    Does not create duplicate alerts while the vehicle
    remains outside.

    Resolves the active geofence alert when the vehicle
    returns inside.
    """

    geofences = (
        db.query(Geofence)
        .filter(Geofence.is_active == True)
        .all()
    )

    alerts = []

    for geofence in geofences:

        distance = calculate_distance(
            latitude,
            longitude,
            geofence.latitude,
            geofence.longitude
        )

        # Vehicle is outside the geofence
        if distance > geofence.radius:

            existing_alert = (
                db.query(Alert)
                .filter(
                    Alert.vehicle_id == vehicle_id,
                    Alert.alert_type == "GEOFENCE",
                    Alert.message
                    == f"Vehicle left geofence '{geofence.name}'",
                    Alert.is_resolved == False
                )
                .first()
            )

            # Create an alert only if there isn't
            # already an active alert
            if not existing_alert:

                alert = Alert(
                    vehicle_id=vehicle_id,
                    alert_type="GEOFENCE",
                    message=(
                        f"Vehicle left geofence "
                        f"'{geofence.name}'"
                    ),
                    speed=0,
                    is_resolved=False
                )

                db.add(alert)
                alerts.append(alert)

        # Vehicle is inside the geofence
        else:

            active_alert = (
                db.query(Alert)
                .filter(
                    Alert.vehicle_id == vehicle_id,
                    Alert.alert_type == "GEOFENCE",
                    Alert.message
                    == f"Vehicle left geofence '{geofence.name}'",
                    Alert.is_resolved == False
                )
                .first()
            )

            # Resolve the previous alert
            if active_alert:
                active_alert.is_resolved = True

    if alerts:
        db.commit()

        for alert in alerts:
            db.refresh(alert)

    else:
        db.commit()

    return alerts