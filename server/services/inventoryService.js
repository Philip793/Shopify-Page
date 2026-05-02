import Inventory from "../models/Inventory.js";
import productCatalog from "../data/productCatalog.js";

/**
 * Initialize inventory from product catalog
 * Syncs catalog data to MongoDB on server startup
 */
export const initializeInventory = async () => {
  try {
    const count = await Inventory.syncFromCatalog(productCatalog);
    console.log(`📦 Inventory initialized: ${count} products synced to MongoDB`);
    return count;
  } catch (error) {
    console.error("❌ Failed to initialize inventory:", error.message);
    throw error;
  }
};

/**
 * Check if there is sufficient inventory for all items in cart
 * ATOMIC: Reads from MongoDB with current available stock
 * @param {Array} cartItems - Array of {id, quantity}
 * @returns {Object} - { available: boolean, insufficientItems: [] }
 */
export const checkInventory = async (cartItems) => {
  const insufficientItems = [];

  for (const item of cartItems) {
    const inventory = await Inventory.findOne({ productId: item.id });
    
    if (!inventory) {
      insufficientItems.push({
        productId: item.id,
        requested: item.quantity,
        available: 0,
        reason: "Product not found in inventory",
      });
      continue;
    }

    if (inventory.availableStock < item.quantity) {
      insufficientItems.push({
        productId: item.id,
        productName: inventory.name,
        requested: item.quantity,
        available: inventory.availableStock,
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
 * Reserve inventory for an order (before payment)
 * ATOMIC: Uses findOneAndUpdate to prevent race conditions
 * @param {Array} cartItems - Array of {id, quantity}
 * @returns {Object} - { success: boolean, reservations: [], errors: [] }
 */
export const reserveInventory = async (cartItems) => {
  const reservations = [];
  const errors = [];

  for (const item of cartItems) {
    const result = await Inventory.checkAndReserve(item.id, item.quantity);
    
    if (!result) {
      const inventory = await Inventory.findOne({ productId: item.id });
      errors.push({
        productId: item.id,
        productName: inventory?.name || "Unknown",
        requested: item.quantity,
        available: inventory?.availableStock || 0,
        reason: "Could not reserve - insufficient stock or product not found",
      });
    } else {
      reservations.push({
        productId: item.id,
        productName: result.name,
        reserved: item.quantity,
        remaining: result.availableStock,
      });
      
      console.log(
        `📦 Reserved: ${result.name} - ${item.quantity} units (available: ${result.availableStock})`,
      );
    }
  }

  // Rollback if any reservation failed
  if (errors.length > 0 && reservations.length > 0) {
    console.warn("⚠️ Rolling back partial reservations...");
    for (const reservation of reservations) {
      const item = cartItems.find(i => i.id === reservation.productId);
      if (item) {
        const inventory = await Inventory.findOne({ productId: item.id });
        if (inventory) {
          await inventory.release(item.quantity);
          console.log(`🔄 Released reservation: ${inventory.name} +${item.quantity}`);
        }
      }
    }
  }

  return {
    success: errors.length === 0,
    reservations,
    errors,
  };
};

/**
 * Confirm reservation (convert to actual sale after payment)
 * ATOMIC: Uses findOneAndUpdate to deduct from total stock
 * @param {Array} cartItems - Array of {id, quantity}
 * @returns {Object} - { success: boolean, updatedProducts: [], errors: [] }
 */
export const confirmInventory = async (cartItems) => {
  const updatedProducts = [];
  const errors = [];

  for (const item of cartItems) {
    const inventory = await Inventory.findOne({ productId: item.id });
    
    if (!inventory) {
      errors.push(`Product ${item.id} not found in inventory`);
      continue;
    }

    const result = await inventory.confirm(item.quantity);
    
    if (!result) {
      errors.push(
        `Failed to confirm inventory for ${inventory.name}: reserved=${inventory.reservedStock}, total=${inventory.totalStock}`,
      );
    } else {
      updatedProducts.push({
        id: item.id,
        name: inventory.name,
        sold: item.quantity,
        remaining: inventory.totalStock - item.quantity,
      });
      
      console.log(
        `📦 Confirmed sale: ${inventory.name} - ${item.quantity} units (total remaining: ${inventory.totalStock - item.quantity})`,
      );
    }
  }

  return {
    success: errors.length === 0,
    updatedProducts,
    errors,
  };
};

/**
 * Reduce inventory after successful order (legacy wrapper)
 * Now uses atomic confirm operation
 * @param {Array} cartItems - Array of {id, quantity}
 * @returns {Object} - { success: boolean, updatedProducts: [], errors: [] }
 */
export const reduceInventory = async (cartItems) => {
  // For direct reduction (no reservation), we atomically decrement
  const updatedProducts = [];
  const errors = [];

  for (const item of cartItems) {
    const result = await Inventory.findOneAndUpdate(
      {
        productId: item.id,
        availableStock: { $gte: item.quantity },
      },
      {
        $inc: { 
          totalStock: -item.quantity,
          availableStock: -item.quantity 
        },
        $set: { lastSync: new Date() },
      },
      { new: true }
    );

    if (!result) {
      const inventory = await Inventory.findOne({ productId: item.id });
      errors.push({
        productId: item.id,
        productName: inventory?.name || "Unknown",
        requested: item.quantity,
        available: inventory?.availableStock || 0,
        reason: "Insufficient stock for atomic decrement",
      });
    } else {
      updatedProducts.push({
        id: item.id,
        name: result.name,
        newInventory: result.totalStock,
        reducedBy: item.quantity,
      });
      
      console.log(
        `📦 Inventory reduced: ${result.name} - ${item.quantity} units (total: ${result.totalStock})`,
      );
    }
  }

  return {
    success: errors.length === 0,
    updatedProducts,
    errors,
  };
};

/**
 * Restore inventory (for cancelled orders or returns)
 * ATOMIC: Increments both total and available stock
 * @param {Array} cartItems - Array of {id, quantity}
 * @returns {Object} - { success: boolean, restoredProducts: [], errors: [] }
 */
export const restoreInventory = async (cartItems) => {
  const restoredProducts = [];
  const errors = [];

  for (const item of cartItems) {
    const result = await Inventory.findOneAndUpdate(
      { productId: item.id },
      {
        $inc: { 
          totalStock: item.quantity,
          availableStock: item.quantity 
        },
        $set: { lastSync: new Date() },
      },
      { new: true }
    );

    if (!result) {
      errors.push(`Product ${item.id} not found in inventory`);
    } else {
      restoredProducts.push({
        id: item.id,
        name: result.name,
        newInventory: result.totalStock,
        restoredBy: item.quantity,
      });
      
      console.log(
        `📦 Inventory restored: ${result.name} + ${item.quantity} units (total: ${result.totalStock})`,
      );
    }
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
 * @returns {number} - Current available inventory count
 */
export const getInventory = async (productId) => {
  const inventory = await Inventory.findOne({ productId });
  return inventory ? inventory.availableStock : 0;
};

/**
 * Get low stock products (below threshold)
 * @param {number} threshold - Inventory threshold (default: 10)
 * @returns {Array} - Products with low inventory
 */
export const getLowStockProducts = async (threshold = 10) => {
  const lowStock = await Inventory.find({
    availableStock: { $lte: threshold },
  }).sort({ availableStock: 1 }).lean();

  return lowStock.map(item => ({
    id: item.productId,
    name: item.name,
    inventory: item.availableStock,
    total: item.totalStock,
    reserved: item.reservedStock,
    sku: item.sku,
  }));
};

/**
 * Get full inventory status for all products
 * @returns {Array} - All inventory records
 */
export const getAllInventory = async () => {
  const inventory = await Inventory.find().lean();
  return inventory.map(item => ({
    id: item.productId,
    name: item.name,
    sku: item.sku,
    total: item.totalStock,
    available: item.availableStock,
    reserved: item.reservedStock,
    isLowStock: item.availableStock <= item.lowStockThreshold,
  }));
};

export default {
  initializeInventory,
  checkInventory,
  reserveInventory,
  confirmInventory,
  reduceInventory,
  restoreInventory,
  getInventory,
  getLowStockProducts,
  getAllInventory,
};
