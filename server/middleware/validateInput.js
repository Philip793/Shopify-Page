import validator from "validator";

/**
 * Sanitize and validate user input
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        // Trim whitespace
        req.body[key] = validator.trim(req.body[key]);
        
        // Escape HTML to prevent XSS
        req.body[key] = validator.escape(req.body[key]);
        
        // Normalize email if it's an email field
        if (key === "email" || key.includes("email")) {
          req.body[key] = validator.normalizeEmail(req.body[key]);
        }
      }
    });
  }
  next();
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password) => {
  // At least 6 chars, 1 number, 1 letter
  return validator.isLength(password, { min: 6 }) && 
         /[a-zA-Z]/.test(password) && 
         /\d/.test(password);
};

/**
 * Input validation middleware for auth routes
 */
export const validateAuthInput = (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (email && !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }
  
  if (password && !validatePasswordStrength(password)) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters with at least 1 letter and 1 number",
    });
  }
  
  if (name && !validator.isLength(name, { min: 2, max: 50 })) {
    return res.status(400).json({
      success: false,
      error: "Name must be between 2 and 50 characters",
    });
  }
  
  next();
};

export default sanitizeInput;
