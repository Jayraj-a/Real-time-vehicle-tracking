from sqlalchemy import Boolean, Column, Integer, String

from database.base import Base


class AppSetting(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(
        String(100),
        default="TrackNow",
    )

    location_refresh_seconds = Column(
        Integer,
        default=5,
    )

    overspeed_notifications = Column(
        Boolean,
        default=True,
    )

    geofence_notifications = Column(
        Boolean,
        default=True,
    )

    dark_mode = Column(
        Boolean,
        default=False,
    )