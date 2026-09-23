import asyncio
import websockets


async def test_websocket():

    uri = "ws://127.0.0.1:8000/ws"

    async with websockets.connect(uri) as websocket:

        print("WebSocket connected!")
        print("Waiting for location updates...")

        try:
            while True:
                message = await websocket.recv()
                print("Location received:", message)

        except websockets.exceptions.ConnectionClosed:
            print("WebSocket connection closed")


asyncio.run(test_websocket())