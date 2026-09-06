const axios = require("axios");
const TTLCache = require("../cache/ttlCache");

const GEOCODING_URL =
    "https://geocoding-api.open-meteo.com/v1/search";

const geocodeCache = new TTLCache(24 * 60 * 60 * 1000);

async function geocodePlace(place) {
    const cacheKey = place.toLowerCase().trim();

    const cachedResult = geocodeCache.get(cacheKey);

    if (cachedResult) {
        console.log("📦 Geocoding cache hit:", place);
        return cachedResult;
    }

    console.log("🌍 Searching location:", place);

    const response = await axios.get(GEOCODING_URL, {
        params: {
            name: place,
            count: 5,
            language: "en",
            format: "json"
        },
        timeout: 10000
    });

    const results = response.data.results || [];

    geocodeCache.set(cacheKey, results);

    return results;
}

module.exports = {
    geocodePlace
};