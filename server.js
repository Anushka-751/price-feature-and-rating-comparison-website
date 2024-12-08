const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Product Search Data
const mockData = {
  flipkart: {
    price: 15000,
    rating: 4.5,
    features: ["6GB RAM", "128GB Storage", "5000mAh Battery"],
    reviews: ["https://via.placeholder.com/100"],
  },
  amazon: {
    price: 14900,
    rating: 4.4,
    features: ["6GB RAM", "128GB Storage", "5050mAh Battery"],
    reviews: ["https://via.placeholder.com/100"],
  },
};

// Search Route
app.get("/search", async (req, res) => {
  const { query } = req.query; // Example: `query=mobile`

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    // Replace these with real API calls to Flipkart and Amazon (requires scraping or API keys)
    const flipkartData = mockData.flipkart;
    const amazonData = mockData.amazon;

    // Return product comparison data
    res.json({
      flipkart: flipkartData,
      amazon: amazonData,
    });
  } catch (error) {
    console.error("Error fetching product data:", error.message);
    res.status(500).json({ error: "Failed to fetch product data" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
