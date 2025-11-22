const database = require("../database");
const csv = require("csv-parser");
const fs = require("fs");
const { CustomError } = require("../middleware/errorhandler");

// get all products
exports.getProducts = async (req, res, next) => {
  const db = await database();
  const products = await db.all("SELECT * FROM products");

  return res.json({
    status: "success",
    message: "Products fetched successfully",
    data: {
      results: products.length,
      products,
    },
  });
};

// get search products by name
exports.searchProducts = async (req, res, next) => {
  const db = await database();
  const { name } = req.query;

  const products = await db.all(
    `SELECT * FROM products WHERE LOWER(name) LIKE LOWER(?)`,
    [`%${name}%`]
  );

  return res.json({
    status: "success",
    message: "Search results fetched successfully",
    data: {
      results: products.length,
      products,
    },
  });
};

// Update product details and log hostory
exports.updateProduct = async (req, res, next) => {
  const db = await database();
  const id = req.params.id;

  const { name, unit, category, brand, stock, status, image } = req.body;

  // get existing product
  const oldProduct = await db.get(`SELECT * FROM products WHERE id = ?`, [id]);
  if (!oldProduct) return next(new CustomError("Product not found", 404));

  // duplicate name check
  const duplicate = await db.get(
    `SELECT id FROM products WHERE LOWER(name)=LOWER(?) AND id != ?`,
    [name, id]
  );
  if (duplicate) {
    return next(new CustomError("Product already exists", 400));
  }

  // log stock change
  if (oldProduct.stock !== stock) {
    await db.run(
      `INSERT INTO inventory_logs (productId, oldStock, newStock, changedBy, timestamp)
         VALUES (?, ?, ?, ?, ?)`,
      [id, oldProduct.stock, stock, "admin", new Date().toISOString()]
    );
  }

  // Update
  await db.run(
    `UPDATE products 
       SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=? 
       WHERE id=?`,
    [name, unit, category, brand, stock, status, image, id]
  );

  return res.json({
    status: "success",
    message: "Product updated successfully",
    data: {
      product: { id, name, unit, category, brand, stock, status, image },
    },
  });
};

// Get inventory change history for a product
exports.getHistory = async (req, res, next) => {
  const db = await database();
  const id = req.params.id;

  const history = await db.all(
    `SELECT * FROM inventory_logs 
       WHERE productId = ? 
       ORDER BY timestamp DESC`,
    [id]
  );

  return res.json({
    status: "success",
    message: "History fetched successfully",
    data: { results: history.length, history },
  });
};

// import products from csv file
exports.importCSV = async (req, res, next) => {
  const db = await database();
  const filePath = req.file.path;

  let added = 0;
  let skipped = 0;
  let duplicates = [];

  const stream = fs.createReadStream(filePath).pipe(csv());
  for await (const row of stream) {
    const { name, unit, category, brand, stock, status, image } = row;

    const existing = await db.get(
      `SELECT id FROM products WHERE LOWER(name)=LOWER(?)`,
      [name]
    );

    if (existing) {
      skipped++;
      duplicates.push({ name, existingId: existing.id });
    } else {
      await db.run(
        `INSERT INTO products (name,unit,category,brand,stock,status,image)
           VALUES (?,?,?,?,?,?,?)`,
        [name, unit, category, brand, stock, status, image]
      );
      added++;
    }
  }

  return res.json({
    status: "success",
    message: "CSV imported successfully",
    data: { added, skipped, duplicates },
  });
};

// export products to csv file
exports.exportCSV = async (req, res, next) => {
  const db = await database();
  const rows = await db.all(`SELECT * FROM products`);

  let csvString = "id,name,unit,category,brand,stock,status,image\n";

  rows.forEach((p) => {
    csvString += `${p.id},${p.name},${p.unit},${p.category},${p.brand},${p.stock},${p.status},${p.image}\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=products.csv");
  return res.send(csvString);
};
