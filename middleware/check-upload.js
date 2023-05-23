const { check } = require('express-validator');

module.exports = [
  check("title").isLength({ min: 8 }),
  check("description").isLength({ min: 10 }),
  check("public").not().isEmpty()
];