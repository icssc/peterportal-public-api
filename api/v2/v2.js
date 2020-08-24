var express = require("express");
var router = express.Router();

var swaggerRouter = require("./swagger");

// route to documentation
router.use("/docs", swaggerRouter);

router.get('/', function(req, res) {
  res.redirect("v2/docs");
});

module.exports = router;