const db = require("../config/db");
const crypto = require("crypto");

// ✅ Encrypt SKU
const encryptSKU = (sku) =>
  crypto.createHash("sha256").update(sku).digest("hex");

// ✅ Get Products
exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.execute("SELECT * FROM product");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ✅ Add Product
exports.addProduct = async (req, res) => {
  try {
    const { SKU, product_name, category_id, material_ids, price } = req.body;

    if (!SKU || !product_name) {
      return res
        .status(400)
        .json({ error: "SKU and Product Name are required" });
    }

    const encryptedSKU = encryptSKU(SKU);

    // Check if SKU exists
    const [existing] = await db.execute("SELECT * FROM product WHERE SKU = ?", [
      encryptedSKU,
    ]);
    if (existing.length) {
      return res.status(400).json({ error: "SKU already exists" });
    }

    // Insert product
    await db.execute(
      "INSERT INTO product (SKU, product_name, category_id, material_ids, price) VALUES (?, ?, ?, ?, ?)",
      [encryptedSKU, product_name, category_id, material_ids, price]
    );

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
};
