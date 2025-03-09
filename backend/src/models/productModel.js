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
          SKU_VALUE VARCHAR(255) NOT NULL UNIQUE,
          product_name VARCHAR(255) NOT NULL,
          category_id INT NOT NULL,
          material_id INT NOT NULL,
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

      await db.execute(`
        CREATE TABLE IF NOT EXISTS user (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
        )
      `);

      console.log("✅ All tables created successfully!");
    } catch (error) {
      console.error("❌ Error creating schema or tables:", error);
      return error;
    }
  },

  // // ✅ Get All Products with Pagination & Filters
  // getProducts: async (page, limit, filters) => {
  //   try {
  //     const offset = (page - 1) * limit;

  //     // ✅ Query to fetch paginated products
  //     let productQuery = `
  //     SELECT
  //       p.*,
  //       c.category_name,
  //       m.material_name,
  //       MIN(pm.url) AS media_url
  //     FROM product p
  //     LEFT JOIN category c ON p.category_id = c.category_id
  //     LEFT JOIN material m ON p.material_id = m.material_id
  //     LEFT JOIN product_media pm ON p.product_id = pm.product_id
  //     WHERE 1=1
  //   `;

  //     // ✅ Query to get total count (without LIMIT)
  //     let countQuery = `
  //         SELECT COUNT(*) AS total_count
  //         FROM product
  //         WHERE 1=1
  //     `;

  //     // Apply filters to both queries
  //     if (filters.SKU) {
  //       const skuFilter = ` AND p.SKU_VALUE LIKE ${db.escape(
  //         "%" + filters.SKU + "%"
  //       )}`;
  //       productQuery += skuFilter;
  //       countQuery += skuFilter;
  //     }

  //     if (filters.product_name) {
  //       const nameFilter = ` AND p.product_name LIKE ${db.escape(
  //         "%" + filters.product_name + "%"
  //       )}`;
  //       productQuery += nameFilter;
  //       countQuery += nameFilter;
  //     }

  //     if (filters.category_id) {
  //       const categoryFilter = ` AND p.category_id = ${db.escape(
  //         filters.category_id
  //       )}`;
  //       productQuery += categoryFilter;
  //       countQuery += categoryFilter;
  //     }

  //     if (filters.material_id) {
  //       const materialFilter = ` AND p.material_id = ${db.escape(
  //         filters.material_id
  //       )}`;
  //       productQuery += materialFilter;
  //       countQuery += materialFilter;
  //     }

  //     // ✅ Group the product query and apply pagination
  //     productQuery += ` GROUP BY p.product_id LIMIT ${
  //       Number(limit) || 10
  //     } OFFSET ${Number(offset) || 0}`;

  //     console.log("Executing Product Query:", productQuery);
  //     console.log("Executing Count Query:", countQuery);

  //     // ✅ Execute both queries
  //     const [products] = await db.query(productQuery);
  //     const [[{ total_count }]] = await db.query(countQuery); // Fetch total count
  //     // console.log(products);
  //     // Format material_names as an array
  //     // const formattedProducts = products.map((product) => ({
  //     //   ...product,
  //     //   material_name: product.material_name || null,
  //     //   media_url: product.media_url || null,
  //     //   SKU_VALUE: product.SKU_VALUE,
  //     // }));

  //     return { products, total_count };
  //   } catch (error) {
  //     console.error("🚨 Database Query Error:", error);
  //     throw new Error("Database query failed");
  //   }
  // },

  getProducts: async (page, limit, filters) => {
    try {
      const offset = (page - 1) * limit;

      let productQuery = `
        SELECT 
          p.*, 
          c.category_name, 
          m.material_name, 
          MIN(pm.url) AS media_url  
        FROM product p
        LEFT JOIN category c ON p.category_id = c.category_id
        LEFT JOIN material m ON p.material_id = m.material_id
        LEFT JOIN product_media pm ON p.product_id = pm.product_id
        WHERE 1=1
      `;

      let countQuery = `
        SELECT COUNT(*) AS total_count
        FROM product p
        WHERE 1=1
      `;

      if (filters.SKU) {
        const skuFilter = ` AND p.SKU_VALUE = ${db.escape(filters.SKU)}`;
        productQuery += skuFilter;
        countQuery += skuFilter;
      }

      if (filters.product_name) {
        const nameFilter = ` AND p.product_name = ${db.escape(
          filters.product_name 
        )}`;
        productQuery += nameFilter;
        countQuery += nameFilter;
      }

      if (filters.category_id) {
        console.log(filters.category_id, "filterss");
        const categoryFilter = ` AND p.category_id = ${db.escape(
          filters.category_id
        )}`;
        productQuery += categoryFilter;
        countQuery += categoryFilter;
      }

      if (filters.material_id) {
        const materialFilter = ` AND p.material_id = ${db.escape(
          filters.material_id
        )}`;
        productQuery += materialFilter;
        countQuery += materialFilter;
      }

      productQuery += ` GROUP BY p.product_id LIMIT ${
        Number(limit) || 10
      } OFFSET ${Number(offset) || 0}`;

      console.log("Executing Product Query:", productQuery);
      console.log("Executing Count Query:", countQuery);

      const [products] = await db.query(productQuery);
      const [[{ total_count }]] = await db.query(countQuery);

      return { products, total_count };
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
    material_name,
    price,
    media_url,
    SKU_VALUE
  ) => {
    const encryptedSKU = encryptSKU(SKU);
    const connection = await db.getConnection(); // Start transaction
    await connection.beginTransaction();

    try {
      // ✅ Fetch all SKUs from the database
      const [existingSKUs] = await db.execute(
        "SELECT * FROM product WHERE SKU = ?",
        [encryptedSKU]
      );
      if (existingSKUs.length > 0) {
        await connection.rollback();
        throw new Error("SKU already exists");
      }

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

      // const materialIds = [];
      // for (let material_name of materials) {
      //   let [materialResult] = await connection.execute(
      //     "SELECT material_id FROM material WHERE material_name = ?",
      //     [material_name]
      //   );

      //   let material_id;
      //   if (materialResult.length > 0) {
      //     material_id = materialResult[0].material_id;
      //   } else {
      //     const [insertMaterial] = await connection.execute(
      //       "INSERT INTO material (material_name) VALUES (?)",
      //       [material_name]
      //     );
      //     material_id = insertMaterial.insertId;
      //   }
      //   materialIds.push(material_id);
      // }

      const insertProductQuery = `
        INSERT INTO product (SKU, SKU_VALUE, product_name, category_id, material_id, price)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [productResult] = await connection.execute(insertProductQuery, [
        encryptedSKU,
        SKU_VALUE,
        product_name,
        category_id,
        material_id,
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
    material_id,
    price,
    media_url
  ) => {
    const connection = await db.getConnection(); // Start transaction
    await connection.beginTransaction();

    try {
      // Update product details
      const updateProductQuery = `
        UPDATE product
        SET product_name = ?, category_id = ?, material_id = ?, price = ?
        WHERE product_id = ?
      `;

      const [productResult] = await connection.execute(updateProductQuery, [
        product_name,
        category_id,
        material_id,
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
