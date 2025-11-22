require("dotenv").config();
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorhandler");

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use("/uploads", express.static("uploads"));
app.use("/api/products", require("./routes/product.routes"));

app.use(errorHandler); // global error handler

module.exports = app;
