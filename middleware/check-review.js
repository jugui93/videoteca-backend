const { check } = require('express-validator');

module.exports = [
  check("rating").isInt({min:0, max:5}),
  check("text").isLength({ max:50 })
];