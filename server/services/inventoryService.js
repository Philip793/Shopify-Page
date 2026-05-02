import productCatalog from "../data/productCatalog.js";

/**
 * Check if there is sufficient inventory for all items in cart
 * @param {Array} cartItems - Array of {id, quantity}
 * @returns {Object} - { available: boolean, insufficientItems: [] }
 */
export const checkInventory = (cartItems) => {
  const insufficientItems = [];

  for (const item of cartItems) {
    const product = productCatalog[item.id];
    if (!product) {
      insufficientItems.push({
        productId: item.id,
        requested: item.quantity,
        available: 0,
        reason: "Product not found",
      });
      continue;
    }

    if (product.inventory < item.quantity) {
      insufficientItems.push({
        productId: item.id,
        productName: product.name,
        requested: item.quantity,
        available: product.inventory,
        reason: "Insufficient stock",
      });
    }
  }

  return {
    available: insufficientItems.length === 0,
    insufficientItems,
  };
};

/**
 * Reduce inventory after successful order
 * @param {Array} cartItems - Array of {id, quantity}
 * @returns {Object} - { success: boolean, updatedProducts: [], errors: [] }
 */
export const reduceInventory = (cartItems) => {
  const updatedProducts = [];
  const errors = [];

  for (const item of cartItems) {
    const product = productCatalog[item.id];

    if (!product) {
      errors.push(`Product ${item.id} not found`);
      continue;
    }

    if (product.inventory < item.quantity) {
      errors.push(
        `Insufficient inventory for ${product.name}: requested ${item.quantity}, available ${product.inventory}`,
      );
      continue;
    }

    // Reduce inventory
    product.inventory -= item.quantity;
    updatedProducts.push({
      id: product.id,
      name: product.name,
      newInventory: product.inventory,
      reducedBy: item.quantity,
    });

    console.log(
      `📦 Inventory reduced: ${product.name} - ${item.quantity} units (remaining: ${product.inventory})`,
    );
  }

  return {
    success: errors.length === 0,
    updatedProducts,
    errors,
  };
};

/**
 * Restore inventory (for cancelled orders or returns)
 * @param {Array} cartItems - Array of {id, quantity}
 * @returns {Object} - { success: boolean, restoredProducts: [], errors: [] }
 */
export const restoreInventory = (cartItems) => {
  const restoredProducts = [];
  const errors = [];

  for (const item of cartItems) {
    const product = productCatalog[item.id];

    if (!product) {
      errors.push(`Product ${item.id} not found`);
      continue;
    }

    // Restore inventory
    product.inventory += item.quantity;
    restoredProducts.push({
      id: product.id,
      name: product.name,
      newInventory: product.inventory,
      restoredBy: item.quantity,
    });

    console.log(
      `📦 Inventory restored: ${product.name} + ${item.quantity} units (now: ${product.inventory})`,
    );
  }

  return {
    success: errors.length === 0,
    restoredProducts,
    errors,
  };
};

/**
 * Get current inventory for a product
 * @param {number} productId
 * @returns {number} - Current inventory count
 */
export const getInventory = (productId) => {
  const product = productCatalog[productId];
  return product ? product.inventory : 0;
};

/**
 * Get low stock products (below threshold)
 * @param {number} threshold - Inventory threshold (default: 10)
 * @returns {Array} - Products with low inventory
 */
export const getLowStockProducts = (threshold = 10) => {
  const lowStock = [];

  for (const [key, product] of Object.entries(productCatalog)) {
    if (product.inventory <= threshold) {
      lowStock.push({
        id: product.id,
        name: product.name,
        inventory: product.inventory,
        sku: product.sku,
      });
    }
  }

  return lowStock.sort((a, b) => a.inventory - b.inventory);
};

export default {
  checkInventory,
  reduceInventory,
  restoreInventory,
  getInventory,
  getLowStockProducts,
};
