const express = require("express");

const {
    getWeather
} = require("../services/weatherService");

const {
    generateAdvisory
} = require("../services/advisoryEngine");

const router = express.Router();

function getWeatherDescription(code) {

    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snowfall",
        73: "Moderate snowfall",
        75: "Heavy snowfall",
        80: "Light rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Heavy thunderstorm with hail"
    };

    return descriptions[code] || "Unknown weather";
}


router.get("/", async (req, res) => {

    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);

    if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
    ) {
        return res.status(400).json({
            success: false,
            error: "Valid latitude and longitude are required"
        });
    }

    try {

        const data = await getWeather(
            latitude,
            longitude
        );

        const current = {
            temperature:
                data.hourly.temperature_2m[0],

            precipitation_probability:
                data.hourly.precipitation_probability[0],

            uv_index:
                data.hourly.uv_index[0],

            weather_code:
                data.hourly.weather_code[0],

            wind_speed:
                data.hourly.wind_speed_10m[0]
        };

        const weather = {
            ...current,
            description:
                getWeatherDescription(current.weather_code),

            unit: {
                temperature:
                    data.hourly_units.temperature_2m,

                wind:
                    data.hourly_units.wind_speed_10m
            }
        };

        const advisory =
            generateAdvisory({
                precipitation_probability:
                    current.precipitation_probability,

                uv_index:
                    current.uv_index
            });

        const hourly = data.hourly.time
            .slice(0, 12)
            .map((time, index) => ({
                time,

                temperature:
                    data.hourly.temperature_2m[index],

                precipitation_probability:
                    data.hourly.precipitation_probability[index],

                uv_index:
                    data.hourly.uv_index[index],

                weather_code:
                    data.hourly.weather_code[index]
            }));

        const daily = data.daily.time.map(
            (date, index) => ({
                date,

                max:
                    data.daily.temperature_2m_max[index],

                min:
                    data.daily.temperature_2m_min[index],

                precipitation:
                    data.daily
                        .precipitation_probability_max[index],

                weather_code:
                    data.daily.weather_code[index],

                description:
                    getWeatherDescription(
                        data.daily.weather_code[index]
                    )
            })
        );

        res.json({
            success: true,

            location: {
                latitude,
                longitude,
                timezone: data.timezone
            },

            weather,

            advisory,

            hourly,

            daily
        });

    } catch (error) {

        console.error(
            "Weather error:",
            error
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = router;
