const ProductModel = require("../models/productModel");

// ✅ Get Products with Pagination & Filters
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      SKU,
      product_name,
      category_id,
      material_ids,
      status,
    } = req.query;

    const filters = { SKU, product_name, category_id, material_ids, status };
    const products = await ProductModel.getProducts(page, limit, filters);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ✅ Add Product
exports.addProduct = async (req, res) => {
  try {
    const { SKU, product_name, category_name, material_names, price } =
      req.body;

    if (
      !SKU ||
      !product_name ||
      !category_name ||
      !material_names ||
      price === undefined ||
      !price ||
      price === ""
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Check for invalid price value (0 or negative)
    if (price <= 0 || isNaN(price)) {
      return res.status(400).json({ error: "Invalid price value" });
    }

    // Call the model function to handle category, materials, and product insertion
    const result = await ProductModel.addProduct(
      SKU,
      product_name,
      category_name,
      material_names,
      price
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to add product" });
  }
};

// ✅ Edit Product
exports.updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { product_name, category_id, material_ids, price } = req.body;

    if (
      !product_id ||
      !product_name ||
      !category_id ||
      !material_ids ||
      !price
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await ProductModel.updateProduct(
      product_id,
      product_name,
      category_id,
      material_ids,
      price
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to update product" });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const result = await ProductModel.deleteProduct(product_id);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to delete product" });
  }
};

// ✅ Get Category-wise Highest Price
exports.getCategoryWiseHighestPrice = async (req, res) => {
  try {
    const result = await ProductModel.getCategoryWiseHighestPrice();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch category-wise highest price" });
  }
};

// ✅ Get Price Range Product Count
exports.getPriceRangeProductCount = async (req, res) => {
  try {
    const result = await ProductModel.getPriceRangeProductCount();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch product count by price range" });
  }
};

// ✅ Get Products Without Media
exports.getProductsWithoutMedia = async (req, res) => {
  try {
    const result = await ProductModel.getProductsWithoutMedia();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products without media" });
  }
};
