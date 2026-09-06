import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.PROD
    ? "https://weather-q81x.onrender.com/api"
    : "http://localhost:5000/api";

function App() {
    const [search, setSearch] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [weather, setWeather] = useState(null);

    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");

    // --------------------------------------------------
    // LIVE LOCATION SEARCH
    // --------------------------------------------------

    useEffect(() => {
        const query = search.trim();

        if (query.length < 2) {
            setLocations([]);
            return;
        }

        const timer = setTimeout(() => {
            searchLocation(query);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);


    async function searchLocation(query = search) {
        if (!query.trim()) {
            setLocations([]);
            return;
        }

        setSearching(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/search?place=${encodeURIComponent(query)}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to search location"
                );
            }

            setLocations(data.results || []);

        } catch (err) {
            console.error(err);
            setLocations([]);
            setError(
                err.message || "Unable to search location"
            );
        } finally {
            setSearching(false);
        }
    }


    // --------------------------------------------------
    // SELECT LOCATION
    // --------------------------------------------------

    async function selectLocation(location) {

        // IMPORTANT:
        // Close dropdown immediately
        setLocations([]);

        // Set selected city
        setSelectedLocation(location);

        // Put selected city inside search box
        setSearch(location.name);

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                `${API_URL}/weather?latitude=${location.latitude}&longitude=${location.longitude}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to fetch weather"
                );
            }

            setWeather(data);

        } catch (err) {

            console.error("Weather error:", err);

            setError(
                err.message || "Unable to fetch weather"
            );

        } finally {
            setLoading(false);
        }
    }


    // --------------------------------------------------
    // WEATHER ICON
    // --------------------------------------------------

    function getWeatherIcon(code) {

        if (code === 0) return "☀️";

        if (code <= 3) return "🌤️";

        if (code <= 48) return "🌫️";

        if (code <= 67) return "🌧️";

        if (code <= 77) return "❄️";

        if (code <= 82) return "🌦️";

        return "⛈️";
    }


    // --------------------------------------------------
    // TIME
    // --------------------------------------------------

    function formatTime(time) {

        return new Date(time).toLocaleTimeString([], {
            hour: "numeric"
        });
    }


    // --------------------------------------------------
    // DATE
    // --------------------------------------------------

    function formatDate(date) {

        return new Date(date).toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric"
        });
    }


    // --------------------------------------------------
    // CLEAR SEARCH
    // --------------------------------------------------

    function clearSearch() {

        setSearch("");
        setLocations([]);
        setSelectedLocation(null);
        setWeather(null);
        setError("");
    }


    return (
        <div className="app">

            {/* =========================================
                HEADER
            ========================================== */}

            <header className="header">

                <div className="brand">

                    <div className="brand-icon">
                        ☁️
                    </div>

                    <div>
                        <h1>WeatherWise</h1>

                        <p>
                            SMART WEATHER ADVISORY
                        </p>
                    </div>

                </div>


                <nav className="nav">

                    <a className="active">
                        Home
                    </a>

                    <a>
                        About
                    </a>

                    <a>
                        Features
                    </a>

                </nav>


                <div className="header-actions">

                    <button className="round-button">
                        ☾
                    </button>

                    <button className="round-button">
                        ◉
                    </button>

                    <div className="timezone-top">
                        📍 Asia/Kolkata
                    </div>

                </div>

            </header>


            {/* =========================================
                MAIN
            ========================================== */}

            <main className="container">


                {/* =====================================
                    LEFT SIDE
                ====================================== */}

                <section className="left-column">

                    <div className="hero">

                        <span className="badge">
                            WEATHER ADVISORY
                        </span>


                        <h2>
                            Know the weather.
                            <br />
                            <span>
                                Plan your day.
                            </span>
                        </h2>


                        <p className="hero-description">
                            Search for any location and get a
                            simple weather advisory based on
                            rain probability and UV index.
                        </p>


                        {/* SEARCH */}

                        <div className="search-wrapper">

                            <div className="search-box">

                                <span className="search-icon">
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search city or place..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setError("");
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter"
                                        ) {
                                            searchLocation();
                                        }
                                    }}
                                />


                                {search && (
                                    <button
                                        className="clear-button"
                                        onClick={clearSearch}
                                    >
                                        ×
                                    </button>
                                )}


                                <button
                                    className="search-button"
                                    onClick={() =>
                                        searchLocation()
                                    }
                                    disabled={searching}
                                >
                                    {searching
                                        ? "..."
                                        : "Search"}
                                </button>

                            </div>


                            {/* =================================
                                LOCATION DROPDOWN
                            ================================== */}

                            {locations.length > 0 && (

                                <div className="location-results">

                                    {locations.map(
                                        (location, index) => (

                                            <button
                                                className="location-item"
                                                key={`${location.id}-${index}`}
                                                onClick={() =>
                                                    selectLocation(
                                                        location
                                                    )
                                                }
                                            >

                                                <span className="location-pin">
                                                    📍
                                                </span>


                                                <div>

                                                    <strong>
                                                        {
                                                            location.name
                                                        }
                                                    </strong>

                                                    <small>
                                                        {[
                                                            location.admin1,
                                                            location.country
                                                        ]
                                                            .filter(
                                                                Boolean
                                                            )
                                                            .join(
                                                                ", "
                                                            )}
                                                    </small>

                                                </div>

                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {error && (
                            <div className="error">
                                ⚠️ {error}
                            </div>
                        )}

                    </div>


                    {/* =====================================
                        HOURLY FORECAST
                    ====================================== */}

                    {weather && !loading && (

                        <section className="forecast-section">

                            <div className="section-header">

                                <h3>
                                    Hourly Forecast
                                </h3>

                                <span>
                                    Next 12 hours
                                </span>

                            </div>


                            <div className="hourly">

                                {weather.hourly.map(
                                    (hour, index) => (

                                        <div
                                            className={
                                                index === 0
                                                    ? "hour active-hour"
                                                    : "hour"
                                            }
                                            key={hour.time}
                                        >

                                            <span className="hour-time">

                                                {index === 0
                                                    ? "Now"
                                                    : formatTime(
                                                        hour.time
                                                    )}

                                            </span>


                                            <div className="hour-icon">

                                                {getWeatherIcon(
                                                    hour.weather_code
                                                )}

                                            </div>


                                            <strong>
                                                {Math.round(
                                                    hour.temperature
                                                )}°
                                            </strong>


                                            <small>
                                                💧{" "}
                                                {
                                                    hour.precipitation_probability
                                                }
                                                %
                                            </small>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}

                </section>


                {/* =========================================
                    RIGHT SIDE
                ========================================== */}

                <section className="right-column">


                    {/* =====================================
                        WEATHER CARD
                    ====================================== */}

                    {loading && (

                        <div className="weather-card loading-card">

                            <div className="spinner"></div>

                            <p>
                                Fetching weather...
                            </p>

                        </div>

                    )}


                    {weather && !loading && (

                        <>

                            <div className="weather-card">

                                <div className="weather-card-top">

                                    <div>

                                        <h2>
                                            {
                                                selectedLocation?.name
                                            }
                                        </h2>

                                        <p>
                                            {[
                                                selectedLocation?.admin1,
                                                selectedLocation?.country
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>

                                    </div>


                                    <div className="weather-time">

                                        <strong>
                                            {new Date()
                                                .toLocaleDateString(
                                                    [],
                                                    {
                                                        weekday:
                                                            "short",
                                                        month:
                                                            "short",
                                                        day:
                                                            "numeric"
                                                    }
                                                )}
                                        </strong>

                                        <span>
                                            {new Date()
                                                .toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour:
                                                            "numeric",
                                                        minute:
                                                            "2-digit"
                                                    }
                                                )}
                                        </span>

                                    </div>

                                </div>


                                <div className="current-weather">

                                    <div className="big-weather-icon">
                                        {getWeatherIcon(
                                            weather.weather
                                                .weather_code
                                        )}
                                    </div>


                                    <div>

                                        <div className="big-temperature">

                                            {Math.round(
                                                weather.weather
                                                    .temperature
                                            )}

                                            <sup>
                                                °C
                                            </sup>

                                        </div>

                                        <p>
                                            {
                                                weather.weather
                                                    .description
                                            }
                                        </p>

                                    </div>

                                </div>


                                {/* METRICS */}

                                <div className="metrics">

                                    <div className="metric">

                                        <div className="metric-icon">
                                            💧
                                        </div>

                                        <div>

                                            <small>
                                                RAIN PROBABILITY
                                            </small>

                                            <strong>
                                                {
                                                    weather.weather
                                                        .precipitation_probability
                                                }%
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="metric">

                                        <div className="metric-icon">
                                            ☀️
                                        </div>

                                        <div>

                                            <small>
                                                UV INDEX
                                            </small>

                                            <strong>
                                                {
                                                    weather.weather
                                                        .uv_index
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="metric">

                                        <div className="metric-icon">
                                            💨
                                        </div>

                                        <div>

                                            <small>
                                                WIND SPEED
                                            </small>

                                            <strong>
                                                {
                                                    weather.weather
                                                        .wind_speed
                                                }

                                                <em>
                                                    {" "}km/h
                                                </em>

                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================
                                ADVISORY
                            ================================== */}

                            <div
                                className={`advisory-card ${weather.advisory.level}`}
                            >

                                <div className="advisory-icon">

                                    {weather.advisory.level ===
                                    "good"
                                        ? "✓"
                                        : "!"}

                                </div>


                                <div>

                                    <span>
                                        ADVISORY
                                    </span>

                                    <h3>
                                        {
                                            weather.advisory.title
                                        }
                                    </h3>

                                    <p>
                                        {
                                            weather.advisory.message
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* =================================
                                3 DAY FORECAST
                            ================================== */}

                            <section className="daily-section">

                                <div className="section-header">

                                    <h3>
                                        3-Day Forecast
                                    </h3>

                                </div>


                                <div className="daily">

                                    {weather.daily.map(
                                        (day, index) => (

                                            <div
                                                className="day"
                                                key={day.date}
                                            >

                                                <div className="day-date">

                                                    <strong>
                                                        {index ===
                                                        0
                                                            ? "Today"
                                                            : formatDate(
                                                                day.date
                                                            )}
                                                    </strong>

                                                    <span>
                                                        {day.description}
                                                    </span>

                                                </div>


                                                <div className="day-icon">

                                                    {getWeatherIcon(
                                                        day.weather_code
                                                    )}

                                                </div>


                                                <div className="day-temp">

                                                    <strong>
                                                        {Math.round(
                                                            day.max
                                                        )}°
                                                    </strong>

                                                    <span>
                                                        {Math.round(
                                                            day.min
                                                        )}°
                                                    </span>

                                                </div>


                                                <div className="day-rain">

                                                    💧{" "}
                                                    {
                                                        day.precipitation
                                                    }%

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        </>

                    )}


                    {/* =====================================
                        EMPTY STATE
                    ====================================== */}

                    {!weather && !loading && (

                        <div className="welcome-card">

                            <div className="welcome-icon">
                                🌤️
                            </div>

                            <h3>
                                Search for a location
                            </h3>

                            <p>
                                Enter a city, town, or place
                                to see its weather forecast
                                and advisory.
                            </p>

                        </div>

                    )}

                </section>

            </main>


            {/* =========================================
                FOOTER
            ========================================== */}

            <footer>

                <div>
                    <strong>
                        WeatherWise
                    </strong>

                    <span>
                        |
                    </span>

                    Rule-based Weather Advisory System
                </div>


                <div>
                    Powered by Open-Meteo ↗
                </div>

            </footer>

        </div>
    );
}

export default App;
