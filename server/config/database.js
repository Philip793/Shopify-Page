import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/shopify-portal";

    const conn = await mongoose.connect(mongoUri, {
      // These options are no longer needed in Mongoose 6+, but keeping for clarity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Exit process in production if DB connection fails
    if (process.env.NODE_ENV === "production") {
      console.error("🚨 CRITICAL: Database connection failed in production. Exiting.");
      process.exit(1);
    }
    return null;
  }
};

export default connectDB;
