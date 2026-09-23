from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TripCreate(BaseModel):
    vehicle_id: int
    driver_id: int | None = None
    start_location: str | None = None
    end_location: str | None = None
    distance: float = 0
    status: str = "ongoing"


class TripResponse(BaseModel):
    id: int
    vehicle_id: int
    driver_id: int | None = None
    start_location: str | None = None
    end_location: str | None = None
    distance: float
    status: str
    start_time: datetime
    end_time: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )