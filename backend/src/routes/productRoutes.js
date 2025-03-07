const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken } = require("../middleware/authMiddleware");

// router.use(verifyToken); // Applies to all routes below

// ✅ Get All Products with Pagination & Filters
router.get("/products", verifyToken, productController.getProducts); //Tested

// ✅ Add a Product
router.post("/products", verifyToken, productController.addProduct); //Tested

// ✅ Update a Product
router.put(
  "/products/:product_id",
  verifyToken,
  productController.updateProduct
); //Tested

// ✅ Delete a Product
router.delete(
  "/products/:product_id",
  verifyToken,
  productController.deleteProduct
); //Tested

// ✅ Get Category-wise Highest Price Products
router.get(
  "/products/category-wise-highest-price",
  verifyToken,
  productController.getCategoryWiseHighestPrice
); //Tested

// ✅ Get Product Count by Price Range
router.get(
  "/products/price-range-count",
  verifyToken,
  productController.getPriceRangeProductCount
); //Tested

// ✅ Get Products Without Media
router.get(
  "/products/without-media",
  verifyToken,
  productController.getProductsWithoutMedia
); //Tested

module.exports = router;
