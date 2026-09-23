from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from models.setting import AppSetting
from schemas.setting import (
    SettingResponse,
    SettingUpdate,
)


router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


def get_or_create_settings(db: Session):
    settings = db.query(AppSetting).first()

    if not settings:
        settings = AppSetting()

        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


@router.get("/", response_model=SettingResponse)
def get_settings(
    db: Session = Depends(get_db),
):
    return get_or_create_settings(db)


@router.put("/", response_model=SettingResponse)
def update_settings(
    data: SettingUpdate,
    db: Session = Depends(get_db),
):
    settings = get_or_create_settings(db)

    for key, value in data.model_dump().items():
        setattr(settings, key, value)

    db.commit()
    db.refresh(settings)

    return settings