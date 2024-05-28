//services/auth/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path:"../../.env" })

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connected to MongoDB Connected ${conn.connection.host}`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;