const request = require("supertest");
const app = require("../server"); // Import the Express app
const db = require("../config/db"); // Import DB connection

describe("POST /api/products", () => {
  beforeAll(async () => {
    await db.getConnection();
  });

  afterAll(async () => {
    await db.end();
  });

  test("✅ Should add a product successfully", async () => {
    const newProduct = {
      SKU: "TEST123",
      product_name: "Test Product",
      category_name: "Electronics",
      materials: ["Plastic", "Metal"],
      price: 99.99,
      media_url: "https://example.com/product.jpg",
    };

    const response = await request(app).post("/api/products").send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Product added successfully");
  });

  test("❌ Should return 400 if SKU already exists", async () => {
    const duplicateProduct = {
      SKU: "TEST123", // Same SKU as previous test
      product_name: "Duplicate Product",
      category_name: "Electronics",
      materials: ["Plastic"],
      price: 49.99,
      media_url: "https://example.com/duplicate.jpg",
    };

    const response = await request(app).post("/api/products").send(duplicateProduct);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "SKU already exists");
  });

  test("❌ Should return 400 if required fields are missing", async () => {
    const incompleteProduct = {
      product_name: "Incomplete Product",
      price: 19.99,
    };

    const response = await request(app).post("/api/products").send(incompleteProduct);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Missing required fields");
  });

  test("✅ Should add a product with a null media_url", async () => {
    const productWithNullMedia = {
      SKU: "NULLSKU123",
      product_name: "No Media Product",
      category_name: "Furniture",
      materials: ["Wood"],
      price: 59.99,
      media_url: null, // No media URL provided
    };

    const response = await request(app).post("/api/products").send(productWithNullMedia);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Product added successfully");
  });

  test("❌ Should return 500 on server error", async () => {
    jest.spyOn(db, "execute").mockRejectedValueOnce(new Error("DB Error"));

    const productWithDBError = {
      SKU: "ERR123",
      product_name: "Error Product",
      category_name: "Toys",
      materials: ["Rubber"],
      price: 29.99,
      media_url: "https://example.com/error.jpg",
    };

    const response = await request(app).post("/api/products").send(productWithDBError);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Internal Server Error");
  });
});
