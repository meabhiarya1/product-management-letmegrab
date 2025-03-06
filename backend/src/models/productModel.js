const mysql = require("mysql2/promise"); // Use mysql2 promise
const db = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();

const schemaName = process.env.DB_SCHEMA;

const ProductModel = {
  createSchemaAndTables: async () => {
    try {
      // ✅ Step 1: Create a separate connection for creating the database
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
      });

      // ✅ Step 2: Create the database if it doesn't exist
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${schemaName}`);
      console.log(`✅ Database "${schemaName}" is ready.`);

      // ✅ Step 3: Close this connection
      await connection.end();

      // ✅ Step 4: Create Tables using the Pooled Connection (NO `USE` command needed)
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
          id INT AUTO_INCREMENT PRIMARY KEY,
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
          FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
        )
      `);

      console.log("✅ All tables created successfully!");
    } catch (error) {
      console.error("❌ Error creating schema or tables:", error);
    }
  },
};

module.exports = ProductModel;
