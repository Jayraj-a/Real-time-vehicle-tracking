from pydantic import BaseModel


class SettingUpdate(BaseModel):
    company_name: str
    location_refresh_seconds: int
    overspeed_notifications: bool
    geofence_notifications: bool
    dark_mode: bool


class SettingResponse(SettingUpdate):
    id: int

    class Config:
        from_attributes = True