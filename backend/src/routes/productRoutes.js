const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");


// ✅ Get All Products with Pagination & Filters
router.get("/products", productController.getProducts);  //Tested

// ✅ Add a Product
router.post("/products", productController.addProduct); //Tested

// ✅ Update a Product
router.put("/products/:product_id", productController.updateProduct);

// ✅ Delete a Product
router.delete("/products/:product_id", productController.deleteProduct);

// ✅ Get Category-wise Highest Price Products
router.get("/products/category-wise-highest-price", productController.getCategoryWiseHighestPrice);

// ✅ Get Product Count by Price Range
router.get("/products/price-range-count", productController.getPriceRangeProductCount);

// ✅ Get Products Without Media
router.get("/products/without-media", productController.getProductsWithoutMedia);

module.exports = router;
