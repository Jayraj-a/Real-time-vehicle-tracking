from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from database.base import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    vehicle_id = Column(
        Integer,
        nullable=False
    )

    driver_id = Column(
        Integer,
        nullable=True
    )

    start_location = Column(
        String(255),
        nullable=True
    )

    end_location = Column(
        String(255),
        nullable=True
    )

    distance = Column(
        Float,
        default=0
    )

    status = Column(
        String(30),
        default="ongoing"
    )

    start_time = Column(
        DateTime,
        default=datetime.utcnow
    )

    end_time = Column(
        DateTime,
        nullable=True
    )