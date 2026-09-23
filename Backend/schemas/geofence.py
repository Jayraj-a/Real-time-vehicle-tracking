from pydantic import BaseModel


class GeofenceCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    radius: float
    is_active: bool = True


class GeofenceResponse(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    radius: float
    is_active: bool

    class Config:
        from_attributes = True