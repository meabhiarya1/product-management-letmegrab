const express = require("express");
const ProductModel = require("./src/models/productModel");

const app = express();
app.use(express.json());

const PORT = 5000;

app.listen(PORT, async () => {
  await ProductModel.createSchemaAndTables(); // Create Schema & Tables on startup
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
