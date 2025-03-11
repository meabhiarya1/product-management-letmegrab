const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const db = require("./src/config/db");
const productRoutes = require("./src/routes/productRoutes");
const ProductModel = require("./src/models/productModel");
const authRoutes = require("./src/routes/authRoutes");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Function to create an admin user if not exists
const createAdminUser = async () => {
  try {
    const email = "admin@gmail.com";
    const password = "123456";

    // ✅ Ensure 'user' table exists before querying
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') NOT NULL
      )
    `);

    // Check if admin already exists
    const [existingUsers] = await db.execute(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("✅ Admin user already exists. Skipping creation.");
      return true;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    await db.execute(
      "INSERT INTO user (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, "admin"]
    );

    console.log("🚀 Admin user created successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    return false;
  }
};
// ✅ Ensure the database and tables are created before starting the server
const initializeDatabase = async () => {
  try {
    await ProductModel.createSchemaAndTables();
    // 🔥 Call createAdminUser after DB is initialized
    const res = await createAdminUser();
    if (!res) {
      throw new Error("Database initialization failed");
    }
    console.log("✅ Database initialized successfully.");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1); // Stop the server if database setup fails
  }
};

// ✅ Define API routes
app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);

// ✅ Handle uncaught errors to prevent crashes
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});

// ✅ Start the server only after DB initialization
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app; // Export the Express app for testing
