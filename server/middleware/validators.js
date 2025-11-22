const { body } = require("express-validator");

exports.productValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a number ≥ 0"),
];
