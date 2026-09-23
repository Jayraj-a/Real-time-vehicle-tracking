from sqlalchemy import Boolean, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    vehicle_number: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False
    )
    vehicle_type: Mapped[str] = mapped_column(String(50), nullable=False)
    driver_name: Mapped[str] = mapped_column(String(100), nullable=True)
    speed_limit: Mapped[float] = mapped_column(Float, default=60.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)