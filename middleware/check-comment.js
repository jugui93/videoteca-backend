const { check } = require('express-validator');

module.exports = [
  check("text").isLength({ max:120 }).not().isEmpty()
];