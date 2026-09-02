const listingRoutes = require("./routes/listings");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const wishlistRoutes = require("./routes/wishlist");

const app = express();

console.log("=== CAMPUSKART SERVER STARTED ===");
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.url}`
  );

  next();
});

app.use(cors({origin: process.env.CLIENT_URL}));

app.use(express.json());


// -----------------------------
// Routes
// -----------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CampusKart backend is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/listings", listingRoutes);

app.use("/api/wishlist", wishlistRoutes);

// -----------------------------
// Server
// -----------------------------

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log(
      "MongoDB connected successfully!"
    );

    app.listen(PORT, () => {
      console.log(
        `CampusKart backend running on port ${PORT}`
      );
    });

  })
  .catch((error) => {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

  });