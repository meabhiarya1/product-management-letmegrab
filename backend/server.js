const express = require("express");
const dotenv = require("dotenv");
const productRoutes = require("./src/routes/productRoutes");
const ProductModel = require("./src/models/productModel");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Parse JSON requests

// ✅ Ensure the database and tables are created before starting the server
const initializeDatabase = async () => {
  try {
    await ProductModel.createSchemaAndTables();
    console.log("✅ Database initialized successfully.");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1); // Stop the server if database setup fails
  }
};

// ✅ Define API routes
app.use("/api", productRoutes);

// ✅ Handle uncaught errors to prevent crashes
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});

// ✅ Start the server only after DB initialization
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
