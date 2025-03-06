const mysql = require("mysql2/promise");
const db = require("../config/db");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();
const schemaName = process.env.DB_NAME;

// ✅ Encrypt SKU Function
const encryptSKU = (sku) =>
  crypto.createHash("sha256").update(sku).digest("hex");

// ✅ Product Model
const ProductModel = {
  // ✅ Create Database & Tables
  createSchemaAndTables: async () => {
    try {
      // Step 1: Create a separate connection for database creation
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
      });

      // Step 2: Create the database if it doesn't exist
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${schemaName}`);
      console.log(`✅ Database "${schemaName}" is ready.`);
      await connection.end();

      // Step 3: Create tables using the main connection pool
      await db.execute(`
        CREATE TABLE IF NOT EXISTS category (
          category_id INT AUTO_INCREMENT PRIMARY KEY,
          category_name VARCHAR(255) NOT NULL UNIQUE
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS material (
          material_id INT AUTO_INCREMENT PRIMARY KEY,
          material_name VARCHAR(255) NOT NULL UNIQUE
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS product (
          product_id INT AUTO_INCREMENT PRIMARY KEY,
          SKU VARCHAR(255) NOT NULL UNIQUE,
          product_name VARCHAR(255) NOT NULL,
          category_id INT NOT NULL,
          material_ids VARCHAR(255) NOT NULL,
          price FLOAT NOT NULL,
          FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS product_media (
          media_id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          url VARCHAR(255) NOT NULL,
          FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
        )
      `);

      console.log("✅ All tables created successfully!");
    } catch (error) {
      console.error("❌ Error creating schema or tables:", error);
    }
  },

  // ✅ Get All Products with Pagination & Filters
  getProducts: async (page, limit, filters) => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM product WHERE 1=1`; // Base query

    const params = [];

    if (filters.SKU) {
      query += ` AND SKU LIKE ?`;
      params.push(`%${filters.SKU}%`);
    }
    if (filters.product_name) {
      query += ` AND product_name LIKE ?`;
      params.push(`%${filters.product_name}%`);
    }
    if (filters.category_id) {
      query += ` AND category_id = ?`;
      params.push(filters.category_id);
    }
    if (filters.material_ids) {
      query += ` AND FIND_IN_SET(?, material_ids)`;
      params.push(filters.material_ids);
    }
    if (filters.status) {
      query += ` AND status = ?`;
      params.push(filters.status);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(+limit, +offset);

    const [products] = await db.execute(query, params);
    return products;
  },

  // ✅ Add Product (with SKU Encryption & Unique Check)
  addProduct: async (SKU, product_name, category_name, materials, price) => {
    const encryptedSKU = encryptSKU(SKU);

    const connection = await db.getConnection(); // Start transaction
    await connection.beginTransaction();

    try {
      //   // ✅ Fetch all SKUs from the database
      const [existingSKUs] = await db.execute("SELECT SKU FROM product");

      //   // ✅ Check if the encrypted SKU exists in the database
      const skuExists = existingSKUs.some((row) => row.SKU === encryptedSKU);

      if (skuExists) {
        throw new Error("SKU already exists");
      }

      // 🔹 Step 1: Insert Category (if not exists)
      let [categoryResult] = await connection.execute(
        "SELECT category_id FROM category WHERE category_name = ?",
        [category_name]
      );

      let category_id;
      if (categoryResult.length > 0) {
        category_id = categoryResult[0].category_id;
      } else {
        const [insertCategory] = await connection.execute(
          "INSERT INTO category (category_name) VALUES (?)",
          [category_name]
        );
        category_id = insertCategory.insertId;
      }

      // 🔹 Step 2: Insert Materials (if not exist) and collect their IDs
      const materialIds = [];
      for (let material_name of materials) {
        let [materialResult] = await connection.execute(
          "SELECT material_id FROM material WHERE material_name = ?",
          [material_name]
        );

        let material_id;
        if (materialResult.length > 0) {
          material_id = materialResult[0].material_id;
        } else {
          const [insertMaterial] = await connection.execute(
            "INSERT INTO material (material_name) VALUES (?)",
            [material_name]
          );
          material_id = insertMaterial.insertId;
        }
        materialIds.push(material_id);
      }

      // 🔹 Step 3: Check if SKU already exists
      const [existing] = await connection.execute(
        "SELECT * FROM product WHERE SKU = ?",
        [encryptedSKU]
      );
      if (existing.length > 0) {
        await connection.rollback();
        throw new Error("SKU already exists");
      }

      // 🔹 Step 4: Insert Product
      const insertQuery = `
        INSERT INTO product (SKU, product_name, category_id, material_ids, price)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.execute(insertQuery, [
        encryptedSKU,
        product_name,
        category_id,
        materialIds.join(","), // Convert array to comma-separated string
        price,
      ]);

      await connection.commit(); // Commit transaction
      return { message: "Product added successfully" };
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      throw error;
    } finally {
      connection.release();
    }
  },
  
  // ✅ Delete Product
  deleteProduct: async (product_id) => {
    const deleteQuery = "DELETE FROM product WHERE product_id = ?";
    await db.execute(deleteQuery, [product_id]);
    return { message: "Product deleted successfully" };
  },

  // ✅ Update Product
  updateProduct: async (
    product_id,
    product_name,
    category_id,
    material_ids,
    price
  ) => {
    const updateQuery = `
      UPDATE product
      SET product_name = ?, category_id = ?, material_ids = ?, price = ?
      WHERE product_id = ?
    `;
    await db.execute(updateQuery, [
      product_name,
      category_id,
      material_ids,
      price,
      product_id,
    ]);
    return { message: "Product updated successfully" };
  },

  // ✅ Get Statistics (Category-wise Highest Price)
  getCategoryWiseHighestPrice: async () => {
    const query = `
      SELECT c.category_name, MAX(p.price) AS highest_price
      FROM product p
      JOIN category c ON p.category_id = c.category_id
      GROUP BY c.category_name
    `;
    const [result] = await db.execute(query);
    return result;
  },

  // ✅ Get Product Count by Price Range
  getPriceRangeProductCount: async () => {
    const query = `
      SELECT 
        SUM(CASE WHEN price BETWEEN 0 AND 500 THEN 1 ELSE 0 END) AS '0-500',
        SUM(CASE WHEN price BETWEEN 501 AND 1000 THEN 1 ELSE 0 END) AS '501-1000',
        SUM(CASE WHEN price > 1000 THEN 1 ELSE 0 END) AS '1000+'
      FROM product;
    `;
    const [result] = await db.execute(query);
    return result[0]; // Return single row
  },

  // ✅ Get Products Without Media
  getProductsWithoutMedia: async () => {
    const query = `
      SELECT p.*
      FROM product p
      LEFT JOIN product_media pm ON p.product_id = pm.product_id
      WHERE pm.product_id IS NULL
    `;
    const [products] = await db.execute(query);
    return products;
  },
};

module.exports = ProductModel;
