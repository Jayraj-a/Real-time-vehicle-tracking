from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LocationCreate(BaseModel):
    vehicle_id: int
    latitude: float
    longitude: float
    speed: float = 0.0
    heading: float = 0.0


class LocationResponse(BaseModel):
    id: int
    vehicle_id: int
    latitude: float
    longitude: float
    speed: float
    heading: float
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)