/**
 * Product Validation Middleware
 * Validates that products have all required fields
 */

const REQUIRED_FIELDS = [
  "id",
  "name",
  "price",
  "category",
  "description",
  "images",
  "inventory",
  "sku",
];

/**
 * Validate a single product object
 * @param {Object} product - Product to validate
 * @param {string} context - Context for error messages (e.g., "cart item", "product catalog")
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateProduct = (product, context = "product") => {
  const errors = [];

  if (!product || typeof product !== "object") {
    return {
      isValid: false,
      errors: [`Invalid ${context}: must be an object`],
    };
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (product[field] === undefined || product[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate specific field types
  if (product.id !== undefined && typeof product.id !== "number") {
    errors.push("Field 'id' must be a number");
  }

  if (
    product.price !== undefined &&
    (typeof product.price !== "number" || product.price < 0)
  ) {
    errors.push("Field 'price' must be a non-negative number");
  }

  if (
    product.inventory !== undefined &&
    (typeof product.inventory !== "number" || product.inventory < 0)
  ) {
    errors.push("Field 'inventory' must be a non-negative number");
  }

  if (
    product.category !== undefined &&
    !Array.isArray(product.category) &&
    typeof product.category !== "string"
  ) {
    errors.push("Field 'category' must be a string or array");
  }

  if (
    product.images !== undefined &&
    (typeof product.images !== "object" || product.images === null)
  ) {
    errors.push("Field 'images' must be an object");
  }

  if (
    product.sku !== undefined &&
    (typeof product.sku !== "string" || product.sku.trim() === "")
  ) {
    errors.push("Field 'sku' must be a non-empty string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Middleware to validate product catalog on startup
 */
export const validateProductCatalog = (productCatalog) => {
  const validationResults = {
    valid: [],
    invalid: [],
  };

  for (const [key, product] of Object.entries(productCatalog)) {
    const result = validateProduct(product, `product ${key}`);
    if (result.isValid) {
      validationResults.valid.push(key);
    } else {
      validationResults.invalid.push({
        productId: key,
        errors: result.errors,
      });
    }
  }

  if (validationResults.invalid.length > 0) {
    console.error("\n❌ Product Catalog Validation Errors:");
    for (const item of validationResults.invalid) {
      console.error(`\nProduct ID ${item.productId}:`);
      for (const error of item.errors) {
        console.error(`  - ${error}`);
      }
    }
    throw new Error(
      `Product catalog validation failed: ${validationResults.invalid.length} products have errors`,
    );
  }

  console.log(
    `\n✅ Product catalog validated: ${validationResults.valid.length} products OK`,
  );
  return validationResults;
};

/**
 * Express middleware to validate cart items
 */
export const validateCartItemsMiddleware = (req, res, next) => {
  const { cartItems } = req.body;

  if (!cartItems || !Array.isArray(cartItems)) {
    return res.status(400).json({ error: "cartItems must be an array" });
  }

  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Cart cannot be empty" });
  }

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];

    if (!item.id || typeof item.id !== "number") {
      return res.status(400).json({
        error: `Invalid cart item at index ${i}: missing or invalid product id`,
      });
    }

    if (
      !item.quantity ||
      typeof item.quantity !== "number" ||
      item.quantity < 1
    ) {
      return res.status(400).json({
        error: `Invalid cart item at index ${i}: quantity must be at least 1`,
      });
    }
  }

  next();
};

export default {
  validateProduct,
  validateProductCatalog,
  validateCartItemsMiddleware,
};
