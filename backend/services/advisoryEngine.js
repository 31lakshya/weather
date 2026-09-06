function readPrecip(weather) {
    return weather.precipitation_probability;
}


function readUV(weather) {
    return weather.uv_index;
}


function rainRule(precip) {

    if (precip > 70) {
        return {
            type: "rain",
            level: "high",
            message:
                "Heavy rain likely — carry an umbrella and stay cautious."
        };
    }

    if (precip > 40) {
        return {
            type: "rain",
            level: "moderate",
            message:
                "You might want to carry an umbrella, rain is possible."
        };
    }

    return null;
}


function uvRule(uv) {

    if (uv > 6) {
        return {
            type: "uv",
            level: "high",
            message:
                "It's sunny out — use sunscreen before heading out."
        };
    }

    return null;
}


function generateAdvisory(weather) {

    const precip = readPrecip(weather);
    const uv = readUV(weather);

    const messages = [
        rainRule(precip),
        uvRule(uv)
    ].filter(Boolean);

    if (messages.length === 0) {
        return {
            level: "good",
            title: "Weather looks clear",
            message: "Weather looks clear along your route.",
            alerts: []
        };
    }

    const highestLevel = messages.some(
        item => item.level === "high"
    )
        ? "high"
        : "moderate";

    return {
        level: highestLevel,
        title:
            highestLevel === "high"
                ? "Weather Advisory"
                : "Weather Notice",
        message: messages.map(item => item.message).join(" "),
        alerts: messages
    };
}


module.exports = {
    readPrecip,
    readUV,
    rainRule,
    uvRule,
    generateAdvisory
};