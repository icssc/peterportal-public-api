var express = require("express");
var router = express.Router();

var swaggerRouter = require("./swagger");
var coursesRouter = require("./courses");
var professorsRouter = require("./professors");
var gradeRouter = require("./gradeDistribution")
var {scheduleRouter} = require("./schedule")

// route to documentation
router.use("/docs", swaggerRouter);
router.use("/courses", coursesRouter);
router.use("/professors", professorsRouter);
router.use("/schedule", scheduleRouter);
router.use("/gradeDistribution", gradeRouter);

router.get('/', function(req, res) {
  res.redirect("v1/docs");
});

module.exports = router;
