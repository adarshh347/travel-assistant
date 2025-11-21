import httpx


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