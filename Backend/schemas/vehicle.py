from pydantic import BaseModel


class VehicleCreate(BaseModel):
    vehicle_number: str
    vehicle_type: str
    driver_name: str | None = None
    speed_limit: float = 60.0


class VehicleResponse(BaseModel):
    id: int
    vehicle_number: str
    vehicle_type: str
    driver_name: str | None
    speed_limit: float
    is_active: bool

    class Config:
        from_attributes = True