import httpx
import asyncio

async def get_lat_lon(city_name: str):
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1&language=ja&format=json"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()
        if "results" in data and data["results"]:
            return data["results"][0]["latitude"], data["results"][0]["longitude"]
    return None, None


async def get_weather(city_name: str):
    """Fetches current weather for a given city."""
    lat, lon = await get_lat_lon(city_name)
    if not lat:
        return f"Could not find location: {city_name}"

    # Fetching temperature and weathercode
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&timezone=auto"

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()

        current = data.get("current", {})
        temp = current.get("temperature_2m", "N/A")
        code = current.get("weather_code", 0)

        # Simple code mapping (can be expanded)
        weather_desc = "Clear"
        if code > 0 and code < 4:
            weather_desc = "Cloudy"
        elif code >= 50:
            weather_desc = "Rainy/Snowy"

        return f"Weather in {city_name}: {temp}°C, Condition: {weather_desc}"


async def get_current_weather_raw(city_name: str, client: httpx.AsyncClient):
    """
    Helper function to get raw data for a single city.
    Returns a dict compatible with our frontend table.
    """
    lat, lon = await get_lat_lon(city_name)
    if not lat:
        return {"city": city_name, "temp": "N/A", "condition": "Unknown", "error": True}

    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&timezone=auto"

    try:
        resp = await client.get(url)
        data = resp.json()

        # Map generic codes to text (Keep it simple for demo)
        code = data["current"]["weather_code"]
        condition = "Clear"
        if code > 3: condition = "Cloudy"
        if code > 50: condition = "Rainy"
        if code > 70: condition = "Snowy"

        return {
            "city": city_name,
            "temp": f"{data['current']['temperature_2m']}°C",
            "condition": condition,
            "error": False
        }
    except Exception:
        return {"city": city_name, "temp": "N/A", "condition": "Error", "error": True}


async def get_weather_multi(cities: list[str]):
    """
    Fetches weather for multiple cities in parallel.
    """
    async with httpx.AsyncClient() as client:
        # Create a list of async tasks
        tasks = [get_current_weather_raw(city, client) for city in cities]
        # Run them all at the same time (Fast!)
        results = await asyncio.gather(*tasks)
    return results