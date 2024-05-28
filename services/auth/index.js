// services/auth/index.js

import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";

//Configure environment variables
dotenv.config();

//Database configuration
connectDB();

//Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Route to check if the server is working
app.get("/", (req, res) => {
  res.send("It's working");
});


// User registration and login routes
app.use("/api/auth", authRoutes);

// Port
const PORT = process.env.PORT || 3909;

// Listen to the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});