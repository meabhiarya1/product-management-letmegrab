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
          url VARCHAR(255),
          FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
        )
      `);

      console.log("✅ All tables created successfully!");
    } catch (error) {
      console.error("❌ Error creating schema or tables:", error);
      return error;
    }
  },

  // // ✅ Get All Products with Pagination & Filters
  getProducts: async (page, limit, filters) => {
    try {
      const offset = (page - 1) * limit;
      let query = `SELECT * FROM product WHERE 1=1`;

      const params = [];

      if (filters.SKU) {
        query += ` AND SKU LIKE ${db.escape("%" + filters.SKU + "%")}`;
      }
      if (filters.product_name) {
        query += ` AND product_name LIKE ${db.escape(
          "%" + filters.product_name + "%"
        )}`;
      }
      if (filters.category_id) {
        query += ` AND category_id = ${db.escape(filters.category_id)}`;
      }
      if (filters.material_ids) {
        let materialIdsArray = filters.material_ids;

        // If material_ids is a string (comma-separated), split it into an array
        if (typeof materialIdsArray === "string") {
          materialIdsArray = materialIdsArray.split(",").map((id) => id.trim());
        }

        if (Array.isArray(materialIdsArray) && materialIdsArray.length > 0) {
          // Generate FIND_IN_SET for each ID dynamically without ?
          const findInSetQueries = materialIdsArray
            .map((id) => `FIND_IN_SET(${db.escape(id)}, material_ids)`)
            .join(" OR ");

          query += ` AND (${findInSetQueries})`;
        }
      }

      // Directly append LIMIT and OFFSET
      const safeLimit = Number(limit) || 10;
      const safeOffset = Number(offset) || 0;
      query += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;

      console.log("Executing Query:", query);

      const [products] = await db.query(query);
      console.log(
        "Products Retrieved:",
        products.length ? products : "No products found"
      );
      return products;
    } catch (error) {
      console.error("🚨 Database Query Error:", error);
      throw new Error("Database query failed");
    }
  },

  // ✅ Add Product (with SKU Encryption & Unique Check)
  addProduct: async (
    SKU,
    product_name,
    category_name,
    materials,
    price,
    media_url
  ) => {
    const encryptedSKU = encryptSKU(SKU);
    const connection = await db.getConnection(); // Start transaction
    await connection.beginTransaction();

    try {
      // ✅ Fetch all SKUs from the database
      const [existingSKUs] = await db.execute("SELECT SKU FROM product");

      // ✅ Check if the encrypted SKU exists in the database
      const skuExists = existingSKUs.some((row) => row.SKU === encryptedSKU);

      if (skuExists) {
        await connection.rollback();
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
      const insertProductQuery = `
        INSERT INTO product (SKU, product_name, category_id, material_ids, price)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [productResult] = await connection.execute(insertProductQuery, [
        encryptedSKU,
        product_name,
        category_id,
        materialIds.join(","), // Convert array to comma-separated string
        price,
      ]);

      const product_id = productResult.insertId; // Get inserted product_id

      // 🔹 Step 5: Insert Media URL (if provided)
      if (media_url) {
        const insertMediaQuery = `
          INSERT INTO product_media (product_id, url)
          VALUES (?, ?)
        `;
        await connection.execute(insertMediaQuery, [product_id, media_url]);
      } else {
        const insertMediaQuery = `
          INSERT INTO product_media (product_id, url)
          VALUES (?, NULL)
        `;
        await connection.execute(insertMediaQuery, [product_id]);
      }

      await connection.commit(); // ✅ Commit transaction
      return { message: "Product added successfully" };
    } catch (error) {
      await connection.rollback(); // ❌ Rollback transaction on error
      throw error;
    } finally {
      connection.release();
    }
  },

  // ✅ Delete Product
  deleteProduct: async (product_id) => {
    const connection = await db.getConnection(); // Get a database connection

    try {
      await connection.beginTransaction(); // ✅ Start transaction

      // ✅ Delete product query
      const deleteQuery = "DELETE FROM product WHERE product_id = ?";
      const [result] = await connection.execute(deleteQuery, [product_id]);

      // ✅ Check if product existed before deleting
      if (result.affectedRows === 0) {
        throw new Error("Product not found");
      }

      await connection.commit(); // ✅ Commit transaction if everything is successful
      return { message: "Product deleted successfully" };
    } catch (error) {
      await connection.rollback(); // ❌ Rollback transaction on error
      throw error;
    } finally {
      connection.release(); // ✅ Release connection back to the pool
    }
  },

  // ✅ Update Product
  updateProduct: async (
    product_id,
    product_name,
    category_id,
    material_ids,
    price,
    media_url
  ) => {
    const connection = await db.getConnection(); // Start transaction
    await connection.beginTransaction();
  
    try {
      // Update product details
      const updateProductQuery = `
        UPDATE product
        SET product_name = ?, category_id = ?, material_ids = ?, price = ?
        WHERE product_id = ?
      `;
  
      const [productResult] = await connection.execute(updateProductQuery, [
        product_name,
        category_id,
        material_ids,
        price,
        product_id,
      ]);
  
      // ✅ Check if the update was successful
      if (productResult.affectedRows === 0) {
        throw new Error("Product not found or no changes made");
      }
  
      // ✅ Insert or update media_url in the product_media table
      if (media_url) {
        const checkMediaQuery = `SELECT * FROM product_media WHERE product_id = ?`;
        const [mediaResult] = await connection.execute(checkMediaQuery, [
          product_id,
        ]);
  
        if (mediaResult.length > 0) {
          // ✅ Update existing media URL
          const updateMediaQuery = `
            UPDATE product_media
            SET url = ?
            WHERE product_id = ?
          `;
          await connection.execute(updateMediaQuery, [media_url, product_id]);
        } else {
          // ✅ Insert new media URL
          const insertMediaQuery = `
            INSERT INTO product_media (product_id, url)
            VALUES (?, ?)
          `;
          await connection.execute(insertMediaQuery, [product_id, media_url]);
        }
      }
  
      await connection.commit(); // ✅ Commit transaction
      return { message: "Product updated successfully" };
    } catch (error) {
      await connection.rollback(); // ❌ Rollback transaction on error
      throw error;
    } finally {
      connection.release(); // ✅ Release connection back to the pool
    }
  },  

  // ✅ Get Statistics (Category-wise Highest Price)
  getCategoryWiseHighestPrice: async () => {
    try {
      const query = `
        SELECT c.category_name, MAX(p.price) AS highest_price
        FROM product p
        JOIN category c ON p.category_id = c.category_id
        GROUP BY c.category_name
      `;

      const [result] = await db.execute(query);
      return result;
    } catch (error) {
      throw error; // Handle errors properly
    }
  },

  // ✅ Get Product Count by Price Range
  getPriceRangeProductCount: async () => {
    try {
      const query = `
        SELECT 
          SUM(CASE WHEN price BETWEEN 0 AND 500 THEN 1 ELSE 0 END) AS '0-500',
          SUM(CASE WHEN price BETWEEN 501 AND 1000 THEN 1 ELSE 0 END) AS '501-1000',
          SUM(CASE WHEN price > 1000 THEN 1 ELSE 0 END) AS '1000+'
        FROM product;
      `;

      const [result] = await db.execute(query);
      return result[0]; // ✅ Return single row (since it's an aggregated result)
    } catch (error) {
      throw error; // Handle error properly
    }
  },

  // ✅ Get Products Without Media
  getProductsWithoutMedia: async () => {
    try {
      const query = `
        SELECT p.*
        FROM product p
        LEFT JOIN product_media pm ON p.product_id = pm.product_id
        WHERE pm.product_id IS NULL OR pm.url IS NULL
      `;
      const [products] = await db.execute(query);
      console.log("Products without media:", products);
      return products;
    } catch (error) {
      console.error("🚨 Database Query Error:", error);
      throw new Error("Failed to fetch products without media");
    }
  },
};

module.exports = ProductModel;
