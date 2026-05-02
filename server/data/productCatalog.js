// Product Catalog (Trusted Source)
// Backend maintains its own product data to prevent price tampering
const productCatalog = {
  1: {
    id: 1,
    name: "18mm Emerald Black Gold D6 - Flesh and Blood",
    price: 19.99,
    category: ["DnD", "TCG", "Board Game"],
    description:
      "Premium 18mm Emerald Black Gold D6 dice for Flesh and Blood TCG.",
    images: {
      thumbnail: "/images/products/1-dice-set/thumbnail.webp",
      main: "/images/products/1-dice-set/1.jpg.webp",
      gallery: ["/images/products/1-dice-set/1.jpg.webp"],
    },
    inventory: 50,
    sku: "DICE-001",
  },
  2: {
    id: 2,
    name: "18MM Cat's Eye Gemstone D6 Dice",
    price: 13.05,
    category: ["DnD", "TCG", "Board Game"],
    description: "Luxury luminous gemstone D6 dice with cat's eye effect.",
    images: {
      thumbnail: "/images/products/18-cat-d6/thumbnail.webp",
      main: "/images/products/18-cat-d6/1.jpg.webp",
      gallery: ["/images/products/18-cat-d6/1.jpg.webp"],
    },
    inventory: 45,
    sku: "DICE-002",
  },
  3: {
    id: 3,
    name: "18MM Rainbow Frosted Crystal Glass D6 Dice",
    price: 23.4,
    category: ["DnD", "TCG", "Board Game"],
    description: "Stunning rainbow frosted crystal glass D6 dice.",
    images: {
      thumbnail: "/images/products/18-mm-rainbow-d6/thumbnail.jpg.webp",
      main: "/images/products/18-mm-rainbow-d6/1.jpg.webp",
      gallery: ["/images/products/18-mm-rainbow-d6/1.jpg.webp"],
    },
    inventory: 30,
    sku: "DICE-003",
  },
  4: {
    id: 4,
    name: "18MM Opalite Gemstone D6 Dice",
    price: 18.0,
    category: ["DnD", "TCG", "Board Game"],
    description: "Beautiful opalite gemstone D6 dice with unique coloring.",
    images: {
      thumbnail: "/images/products/18mm-opa-d6/thumbnail.webp",
      main: "/images/products/18mm-opa-d6/1.jpg.webp",
      gallery: ["/images/products/18mm-opa-d6/1.jpg.webp"],
    },
    inventory: 40,
    sku: "DICE-004",
  },
  5: {
    id: 5,
    name: "Metal Resource Token Set",
    price: 13.99,
    category: ["TCG", "Board Game"],
    description: "High-quality metal resource tokens for board games.",
    images: {
      thumbnail: "/images/products/metal-resource-token/thumbnail.jpg.webp",
      main: "/images/products/metal-resource-token/1.jpg.webp",
      gallery: ["/images/products/metal-resource-token/1.jpg.webp"],
    },
    inventory: 60,
    sku: "TOKEN-001",
  },
  6: {
    id: 6,
    name: "Go Again & Dominate Metal Token",
    price: 13.99,
    category: ["TCG"],
    description: "Metal tokens for Flesh and Blood TCG special abilities.",
    images: {
      thumbnail: "/images/products/dom-metal-token/thumbnail.webp",
      main: "/images/products/dom-metal-token/1.jpg.webp",
      gallery: ["/images/products/dom-metal-token/1.jpg.webp"],
    },
    inventory: 55,
    sku: "TOKEN-002",
  },
  7: {
    id: 7,
    name: "20MM Sharp Resin FaB Resource Dice",
    price: 9.0,
    category: ["TCG"],
    description: "20mm sharp resin dice for Flesh and Blood resource tracking.",
    images: {
      thumbnail: "/images/products/20mm-resin-fab/thumbnail.webp",
      main: "/images/products/20mm-resin-fab/1.jpg.webp",
      gallery: ["/images/products/20mm-resin-fab/1.jpg.webp"],
    },
    inventory: 70,
    sku: "DICE-005",
  },
  8: {
    id: 8,
    name: "20MM Sharp Resin Spindown D6 Dice",
    price: 8.0,
    category: ["DnD", "TCG"],
    description: "20mm sharp resin spindown D6 dice for life tracking.",
    images: {
      thumbnail: "/images/products/20mm-resin-d6/thumbnail.webp",
      main: "/images/products/20mm-resin-d6/1.jpg.webp",
      gallery: ["/images/products/20mm-resin-d6/1.jpg.webp"],
    },
    inventory: 80,
    sku: "DICE-006",
  },
};

// Shipping cost (AUD cents)
const SHIPPING_COST = 1000; // $10.00

/**
 * Calculate cart total from trusted product catalog
 * @param {Array} cartItems - Array of {id, quantity} from frontend
 * @returns {Object} - { subtotal, shipping, total, items }
 */
export const calculateCartTotal = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  let subtotal = 0;
  const validatedItems = [];

  for (const item of cartItems) {
    const product = productCatalog[item.id];
    if (!product) {
      throw new Error(`Invalid product ID: ${item.id}`);
    }

    const quantity = Math.max(1, parseInt(item.quantity) || 1);
    const itemTotal = Math.round(product.price * 100) * quantity; // Convert to cents
    subtotal += itemTotal;

    validatedItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      total: (itemTotal / 100).toFixed(2),
    });
  }

  const total = subtotal + SHIPPING_COST;

  return {
    subtotal: (subtotal / 100).toFixed(2),
    shipping: (SHIPPING_COST / 100).toFixed(2),
    total: (total / 100).toFixed(2),
    totalCents: total,
    items: validatedItems,
  };
};

export default productCatalog;
