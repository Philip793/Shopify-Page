import mongoose from "mongoose";

const LoginAttemptSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastAttempt: {
      type: Date,
      default: Date.now,
    },
    lockoutUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index for cleanup - auto-expire old records after 24 hours
LoginAttemptSchema.index({ lastAttempt: 1 }, { expireAfterSeconds: 86400 });

const LoginAttempt = mongoose.model("LoginAttempt", LoginAttemptSchema);

export default LoginAttempt;
