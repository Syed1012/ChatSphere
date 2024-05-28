// services/auth/routes/auth.js

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import admin from "../firebase.js"; // Ensure this path is correct
import User from "./User.js";
import connectDB from "../db.js";

const router = express.Router();

connectDB();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate unique ID for user
    const userId = uuidv4();

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      uid: userId,
      email,
      phoneNumber,
    });

    // Create user in MongoDB
    const newUser = new User({
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;