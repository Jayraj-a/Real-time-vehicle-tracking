from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from database.base import Base


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=True
    )

    license_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    vehicle_id = Column(
        Integer,
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )