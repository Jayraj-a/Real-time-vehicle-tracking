from database.base import Base
from database.connection import engine
from models.driver import Driver

from models.vehicle import Vehicle
from models.location import Location
from models.alert import Alert
from models.geofence import Geofence

from models.driver import Driver
from models.trip import Trip
from models.setting import AppSetting


def init_db():
    Base.metadata.create_all(
        bind=engine
    )


if __name__ == "__main__":
    init_db()