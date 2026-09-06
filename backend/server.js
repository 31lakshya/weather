const express = require("express");
const cors = require("cors");

const searchRoutes = require("./routes/search");
const weatherRoutes = require("./routes/weather");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/search", searchRoutes);
app.use("/api/weather", weatherRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Weather Advisory API is running"
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🌤️ Weather server running at http://localhost:${PORT}`);
});