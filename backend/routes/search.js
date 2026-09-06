const express = require("express");

const {
    geocodePlace
} = require("../services/geocodeService");

const router = express.Router();

router.get("/", async (req, res) => {
    const place = req.query.place?.trim();

    if (!place) {
        return res.status(400).json({
            success: false,
            error: "Please enter a place"
        });
    }

    try {
        const results = await geocodePlace(place);

        res.json({
            success: true,
            results
        });

    } catch (error) {
        console.error("Geocoding error:", error.message);

        res.status(500).json({
            success: false,
            error: "Unable to search location"
        });
    }
});

module.exports = router;