import jwt from "jsonwebtoken";
import User from "../models/User.js";
import LoginAttempt from "../models/LoginAttempt.js";

// Lockout configuration
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 5;
const ATTEMPT_WINDOW_MINUTES = 5;

// Pre-create admin user (in production, use proper admin creation flow)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Initialize admin user in database
const initAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (!existingAdmin) {
      await User.create({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        name: "Admin",
      });
      console.log("✅ Admin user initialized in database");
    }
  } catch (error) {
    console.error("❌ Failed to initialize admin:", error.message);
  }
};

initAdmin();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
};

/**
 * Register a new customer
 */
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "Email, password, and name are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User already exists",
      });
    }

    // Create user (password will be hashed by the pre-save hook)
    const user = await User.create({
      email,
      password,
      name,
      role: "user",
    });

    // Generate token
    const token = generateToken(user);

    console.log(`✅ New customer registered: ${email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
};

/**
 * Get client IP address
 */
const getClientIP = (req) => {
  return (
    req.ip ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.connection?.remoteAddress ||
    "unknown"
  );
};

/**
 * Check if account is locked
 */
const isAccountLocked = async (email, ipAddress) => {
  const record = await LoginAttempt.findOne({ email });
  
  if (!record) return { locked: false };
  
  // Check if currently locked
  if (record.lockoutUntil && record.lockoutUntil > new Date()) {
    const remainingMinutes = Math.ceil(
      (record.lockoutUntil - new Date()) / (1000 * 60)
    );
    return { 
      locked: true, 
      remainingMinutes,
      message: `Account locked. Try again in ${remainingMinutes} minute(s).`
    };
  }
  
  // Check if within attempt window and max attempts reached
  const windowStart = new Date(Date.now() - ATTEMPT_WINDOW_MINUTES * 60 * 1000);
  
  if (record.lastAttempt > windowStart && record.attempts >= MAX_FAILED_ATTEMPTS) {
    // Lock the account
    record.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
    await record.save();
    
    return { 
      locked: true, 
      remainingMinutes: LOCKOUT_DURATION_MINUTES,
      message: `Account locked due to ${MAX_FAILED_ATTEMPTS} failed attempts. Try again in ${LOCKOUT_DURATION_MINUTES} minutes.`
    };
  }
  
  // Reset if outside window
  if (record.lastAttempt <= windowStart) {
    record.attempts = 0;
    record.lockoutUntil = null;
    await record.save();
  }
  
  return { locked: false };
};

/**
 * Record failed login attempt
 */
const recordFailedAttempt = async (email, ipAddress) => {
  const record = await LoginAttempt.findOneAndUpdate(
    { email },
    {
      $inc: { attempts: 1 },
      $set: { 
        lastAttempt: new Date(),
        ipAddress 
      },
    },
    { upsert: true, new: true }
  );
  
  // Check if we just hit the limit
  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
    await record.save();
    
    console.warn(`🔒 Account locked: ${email} after ${MAX_FAILED_ATTEMPTS} failed attempts`);
    return { 
      locked: true, 
      remainingAttempts: 0,
      message: `Account locked due to ${MAX_FAILED_ATTEMPTS} failed attempts. Try again in ${LOCKOUT_DURATION_MINUTES} minutes.`
    };
  }
  
  return { 
    locked: false, 
    remainingAttempts: MAX_FAILED_ATTEMPTS - record.attempts,
    message: `Invalid credentials. ${MAX_FAILED_ATTEMPTS - record.attempts} attempt(s) remaining before lockout.`
  };
};

/**
 * Reset login attempts on successful login
 */
const resetLoginAttempts = async (email) => {
  await LoginAttempt.findOneAndDelete({ email });
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = getClientIP(req);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Check if account is locked
    const lockStatus = await isAccountLocked(email, ipAddress);
    if (lockStatus.locked) {
      return res.status(423).json({
        success: false,
        error: lockStatus.message,
        locked: true,
        remainingMinutes: lockStatus.remainingMinutes,
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Record failed attempt even if user doesn't exist (prevent username enumeration)
      const attemptStatus = await recordFailedAttempt(email, ipAddress);
      
      return res.status(401).json({
        success: false,
        error: attemptStatus.locked ? attemptStatus.message : "Invalid credentials",
        remainingAttempts: attemptStatus.remainingAttempts,
        locked: attemptStatus.locked,
        ...(attemptStatus.locked && { remainingMinutes: LOCKOUT_DURATION_MINUTES }),
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      const attemptStatus = await recordFailedAttempt(email, ipAddress);
      
      console.warn(`⚠️  Failed login attempt ${attemptStatus.attempts || 'locked'} for: ${email} from IP: ${ipAddress}`);
      
      return res.status(401).json({
        success: false,
        error: attemptStatus.message,
        remainingAttempts: attemptStatus.remainingAttempts,
        locked: attemptStatus.locked,
        ...(attemptStatus.locked && { remainingMinutes: LOCKOUT_DURATION_MINUTES }),
      });
    }

    // Reset failed attempts on successful login
    await resetLoginAttempts(email);

    // Generate token
    const token = generateToken(user);

    console.log(`✅ User logged in: ${email} (${user.role}) from IP: ${ipAddress}`);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
};

/**
 * Get current user
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user",
    });
  }
};

/**
 * Logout user (client-side token removal)
 */
export const logout = async (req, res) => {
  console.log(`👋 User logged out: ${req.user?.email}`);
  res.json({
    success: true,
    message: "Logout successful",
  });
};

export { JWT_SECRET };
