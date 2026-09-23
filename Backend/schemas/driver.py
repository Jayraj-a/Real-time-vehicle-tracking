from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DriverCreate(BaseModel):
    name: str
    phone: str | None = None
    license_number: str
    vehicle_id: int | None = None
    is_active: bool = True


class DriverResponse(BaseModel):
    id: int
    name: str
    phone: str | None = None
    license_number: str
    vehicle_id: int | None = None
    is_active: bool
    created_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )