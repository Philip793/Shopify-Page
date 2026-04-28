# Product Management Setup Guide

## Overview
This guide explains how to set up and manage products for your live Magestic board game store.

## File Structure
```
src/
├── data/
│   └── products.js          # Centralized product database
├── components/
│   ├── FeaturedProducts.js  # Uses getFeaturedProducts()
│   ├── ShopPage.js          # Uses products + category filtering
│   ├── ProductPage.js       # Uses getProductById()
│   └── ...
public/
└── images/
    └── products/
        ├── elegant-board-game-thumb.jpg
        ├── elegant-board-game-main.jpg
        ├── elegant-board-game-1.jpg
        ├── elegant-board-game-2.jpg
        ├── elegant-board-game-3.jpg
        └── ... (other product images)
```

## Product Data Structure
Each product in `src/data/products.js` includes:
- **Basic Info**: id, name, price, category, description
- **Images**: thumbnail, main, gallery array
- **Inventory**: inStock, quantity, sku
- **Ratings**: average score, review count
- **Tags**: Array of searchable tags
- **Flags**: featured, newArrival, bestseller

## Image Setup

### 1. Create Image Folder
```bash
mkdir -p public/images/products
```

### 2. Add Product Images
For each product, you need:
- **Thumbnail**: 400x300px, optimized for web
- **Main Image**: 800x600px, high quality
- **Gallery Images**: 800x600px, multiple angles

### 3. Image Naming Convention
Use the SKU-based naming:
```
elegant-board-game-thumb.jpg
elegant-board-game-main.jpg
elegant-board-game-1.jpg
elegant-board-game-2.jpg
elegant-board-game-3.jpg
```

## Product Management Functions

### Available Functions
```javascript
import { 
  products,                    // All products array
  getProductById,             // Get single product by ID
  getProductsByCategory,      // Filter by category
  getFeaturedProducts,        // Get featured products
  getNewArrivals,            // Get new arrivals
  getBestsellers,            // Get bestselling products
  searchProducts,            // Search products
  getRelatedProducts         // Get related products
} from '../data/products.js';
```

### Usage Examples
```javascript
// Get all products
const allProducts = products;

// Get single product
const product = getProductById(1);

// Filter by category
const familyGames = getProductsByCategory('Family Games');

// Search products
const searchResults = searchProducts('strategy');

// Get related products
const related = getRelatedProducts(productId, 4);
```

## Adding New Products

### 1. Update products.js
```javascript
{
  id: 9, // Next available ID
  name: "New Game Name",
  price: 99.99,
  category: "Strategy Games",
  description: "Product description...",
  features: ["Feature 1", "Feature 2"],
  images: {
    thumbnail: "/images/products/new-game-thumb.jpg",
    main: "/images/products/new-game-main.jpg",
    gallery: [
      "/images/products/new-game-1.jpg",
      "/images/products/new-game-2.jpg",
      "/images/products/new-game-3.jpg"
    ]
  },
  inventory: {
    inStock: true,
    quantity: 25,
    sku: "MG-NG-009"
  },
  ratings: {
    average: 4.5,
    reviews: 12
  },
  tags: ["strategy", "new", "multiplayer"],
  featured: true,    // Show on homepage
  newArrival: true,   // Show in new arrivals
  bestseller: false  // Show in bestsellers
}
```

### 2. Add Images
Place images in `public/images/products/` following the naming convention.

## Component Integration

### FeaturedProducts Component
- Uses `getFeaturedProducts()` automatically
- Shows 3 featured products on homepage
- Clicks navigate to product detail pages

### ShopPage Component
- Uses all `products` with category filtering
- Dynamic category buttons
- Responsive grid layout
- Clicks navigate to product detail pages

### ProductPage Component
- Uses `getProductById()` for single product
- Shows full product details and gallery
- Related products section
- Add to cart functionality

## Inventory Management

### Stock Status
Products automatically show "In Stock" or "Out of Stock" based on:
```javascript
inventory: {
  inStock: true,    // Boolean
  quantity: 25,      // Number
  sku: "MG-EBG-001" // Unique identifier
}
```

### Low Stock Alerts
You can add logic to show alerts when quantity < 5.

## SEO Benefits

### Structured Data
Each product page includes:
- Product schema markup
- Proper meta tags
- Breadcrumb navigation
- Image alt tags

### Search Friendly
- Product names in URLs
- Category-based URLs
- Searchable tags
- Optimized image names

## Production Deployment

### 1. Build Images
- Optimize all images for web (WebP format recommended)
- Ensure all image paths are correct
- Test image loading

### 2. Update Environment
```bash
# No changes needed - products are client-side
# Images are served from public folder
```

### 3. Test Navigation
- Test all product links
- Verify category filtering
- Check search functionality
- Test add to cart

## Maintenance

### Adding Products
1. Add to `src/data/products.js`
2. Add images to `public/images/products/`
3. Test product pages

### Updating Products
1. Update product data in `src/data/products.js`
2. Update images if needed
3. Test changes

### Removing Products
1. Remove from `src/data/products.js`
2. Remove images (optional)
3. Test related products still work

## Performance Considerations

### Image Optimization
- Use WebP format for better compression
- Implement lazy loading for galleries
- Consider CDN for images

### Data Loading
- Products load client-side (fast for small catalogs)
- Consider API integration for large catalogs
- Implement caching for frequently accessed products

This system provides a solid foundation for your e-commerce store with easy product management and excellent user experience.
