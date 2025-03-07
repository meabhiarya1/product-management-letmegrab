const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");


// ✅ Get All Products with Pagination & Filters
router.get("/products", productController.getProducts);  //Tested

// ✅ Add a Product
router.post("/products", productController.addProduct); //Tested

// ✅ Update a Product
router.put("/products/:product_id", productController.updateProduct); //Tested

// ✅ Delete a Product
router.delete("/products/:product_id", productController.deleteProduct); //Tested

// ✅ Get Category-wise Highest Price Products
router.get("/products/category-wise-highest-price", productController.getCategoryWiseHighestPrice);  //Tested

// ✅ Get Product Count by Price Range
router.get("/products/price-range-count", productController.getPriceRangeProductCount); //Tested

// ✅ Get Products Without Media
router.get("/products/without-media", productController.getProductsWithoutMedia); //Tested

module.exports = router;
