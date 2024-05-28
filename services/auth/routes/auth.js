// services/auth/routes/auth.js

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import User from "./User.js";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

// Initialize router
const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Temporary storage for user details and OTP
const tempStorage = {};

// User registration route
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  // Check if firstName, lastName, and phoneNumber are not empty
  if (!firstName || !lastName || !email || !phoneNumber) {
    return res
      .status(400)
      .json({
        message: "First name, last name, email and phone number are required",
      });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate unique ID for user
    const userId = uuidv4();

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code for signup",
      text: `Your OTP code is ${otp}, Thank You for signup with us.`,
    });

    // Store user details and OTP in temporary storage
    tempStorage[email] = { firstName, lastName, phoneNumber, otp };

    // Redirect to verify-otp page
    res.redirect(`/verify-otp?email=${email}`);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User OTP verification route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = tempStorage[email];

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Save user to database
    const newUser = new User({
      userId: uuidv4(),
      firstName: user.firstName,
      lastName: user.lastName,
      email,
      phoneNumber: user.phoneNumber,
    });
    await newUser.save();

    // Remove user from temporary storage
    delete tempStorage[email];

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const payload = { id: user.id, name: user.firstName };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { name: user.firstName, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
