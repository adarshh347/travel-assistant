import httpx
import asyncio


async def get_lat_lon(city_name: str):
    # Force language=ja to get Japanese city names if possible
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1&language=ja&format=json"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()
        if "results" in data and data["results"]:
            return data["results"][0]["latitude"], data["results"][0]["longitude"]
    return None, None


async def get_current_weather_raw(city_name: str, client: httpx.AsyncClient):
    lat, lon = await get_lat_lon(city_name)
    if not lat:
        return {"city": city_name, "error": True}

    # ✅ ADDED: relative_humidity_2m, wind_speed_10m, precipitation_probability
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code&timezone=auto"

    try:
        resp = await client.get(url)
        data = resp.json()
        curr = data["current"]

        # Map Code to Text
        code = curr["weather_code"]
        condition = "晴れ (Clear)"
        if code > 3: condition = "曇り (Cloudy)"
        if code > 50: condition = "雨 (Rainy)"
        if code > 70: condition = "雪 (Snowy)"

        return {
            "city": city_name,
            "temp": f"{curr['temperature_2m']}°C",
            "humidity": f"{curr['relative_humidity_2m']}%",  # ✅ New
            "wind": f"{curr['wind_speed_10m']} km/h",  # ✅ New
            "rain_chance": f"{curr['precipitation_probability']}%",  # ✅ New
            "condition": condition,
            "error": False
        }
    except Exception as e:
        print(f"Weather API Error for {city_name}: {e}")
        return {"city": city_name, "error": True}


async def get_weather_multi(cities: list[str]):
    async with httpx.AsyncClient() as client:
        tasks = [get_current_weather_raw(city, client) for city in cities]
        results = await asyncio.gather(*tasks)
    return results