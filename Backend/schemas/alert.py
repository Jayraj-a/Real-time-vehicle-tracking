from datetime import datetime

from pydantic import BaseModel


class AlertResponse(BaseModel):
    id: int
    vehicle_id: int
    alert_type: str
    message: str
    speed: float
    created_at: datetime
    is_resolved: bool

    class Config:
        from_attributes = True