import time
import requests


API_URL = "http://127.0.0.1:8000/locations/"

vehicle_id = 1

locations = [
    (17.6868, 83.2185),
    (17.6872, 83.2190),
    (17.6876, 83.2195),
    (17.6880, 83.2200),
    (17.6884, 83.2205),
    (17.6888, 83.2210),
]

speed = 45
heading = 90


for latitude, longitude in locations:

    data = {
        "vehicle_id": vehicle_id,
        "latitude": latitude,
        "longitude": longitude,
        "speed": speed,
        "heading": heading
    }

    try:
        response = requests.post(API_URL, json=data)

        print(
            f"Location sent: "
            f"{latitude}, {longitude} | "
            f"Status: {response.status_code}"
        )

        if response.status_code != 200:
            print(response.text)

    except requests.exceptions.RequestException as error:
        print("Connection error:", error)

    time.sleep(2)