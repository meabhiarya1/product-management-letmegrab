const ProductModel = require("../models/productModel");

// ✅ Get Products with Pagination & Filters
exports.getProducts = async (req, res) => {
  try {
    const { page, limit, SKU, product_name, category_id, material_ids } =
      req.query;

    const filters = { SKU, product_name, category_id, material_ids };

    const products = await ProductModel.getProducts(page, limit, filters);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ✅ Add Product
exports.addProduct = async (req, res) => {
  try {
    let { SKU, product_name, category_name, material_names, price, media_url } =
      req.body;

    // ✅ Check for missing fields
    if (
      !SKU ||
      !product_name ||
      !category_name ||
      !material_names ||
      price === undefined
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required except media_url" });
    }

    // ✅ Convert empty string `""` price to NaN for proper validation
    price = Number(price);

    // ✅ Check for invalid price value (0, negative, or non-numeric)
    if (typeof price !== "number" || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid price value" });
    }

    // ✅ Ensure `media_url` is null if not provided
    if (!media_url) {
      media_url = null;
    }

    // Call the model function to handle category, materials, and product insertion
    const result = await ProductModel.addProduct(
      SKU,
      product_name,
      category_name,
      material_names,
      price,
      media_url
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to add product" });
  }
};

// ✅ Edit Product
exports.updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { product_name, category_id, material_ids, price, media_url } =
      req.body;

    if (
      !product_id ||
      !product_name ||
      !category_id ||
      !material_ids ||
      !price
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required except media_url" });
    }

    const result = await ProductModel.updateProduct(
      product_id,
      product_name,
      category_id,
      material_ids,
      price,
      media_url // ✅ Pass media_url to model
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
