// services/auth/routes/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  registerOtp: { type: String },
  registerOtpExpires: { type: Date },
  loginOtp: { type: String },
  loginOtpExpires: { type: Date },
});

const User = mongoose.model("User", userSchema);

export default User;
