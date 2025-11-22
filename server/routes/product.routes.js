const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  getProducts,
  searchProducts,
  updateProduct,
  importCSV,
  exportCSV,
  getHistory,
} = require("../controllers/product.controller");

router.get("/", getProducts); // get all products
router.get("/search", searchProducts); // search products
router.put("/:id", updateProduct); // update product by id
router.get("/:id/history", getHistory); // get inventory history for a product by id
router.post("/import", upload.single("csvFile"), importCSV); // import products from CSV file
router.get("/export", exportCSV); // export products to CSV file

module.exports = router;
