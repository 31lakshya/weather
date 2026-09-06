const axios = require("axios");
const TTLCache = require("../cache/ttlCache");

const WEATHER_URL =
    "https://api.open-meteo.com/v1/forecast";

const weatherCache = new TTLCache(10 * 60 * 1000);

async function getWeather(latitude, longitude) {

    const roundedLat = Number(latitude).toFixed(2);
    const roundedLon = Number(longitude).toFixed(2);

    const cacheKey = `${roundedLat},${roundedLon}`;

    const cachedWeather = weatherCache.get(cacheKey);

    if (cachedWeather) {
        console.log("📦 Weather cache hit:", cacheKey);
        return cachedWeather;
    }

    console.log("🌦️ Fetching weather:", cacheKey);

    const response = await axios.get(WEATHER_URL, {
        params: {
            latitude: roundedLat,
            longitude: roundedLon,
            hourly: [
                "temperature_2m",
                "precipitation_probability",
                "uv_index",
                "weather_code",
                "wind_speed_10m"
            ].join(","),
            daily: [
                "temperature_2m_max",
                "temperature_2m_min",
                "weather_code",
                "precipitation_probability_max"
            ].join(","),
            forecast_days: 3,
            timezone: "auto"
        },
        timeout: 10000
    });

    weatherCache.set(cacheKey, response.data);

    return response.data;
}

module.exports = {
    getWeather
};
