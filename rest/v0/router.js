var express = require("express");
var router = express.Router();

var coursesRouter = require("./courses");
var gradesRouter = require("./grade_distribution");
var instructorRouter = require("./instructor");
var docRouter = require("../docs/docs")

router.get("/", (req,res) => {
    res.redirect('/rest/v0/docs')
})

router.use("/docs", docRouter);

router.use("/courses", coursesRouter);
router.use("/instructors", instructorRouter);
router.use("/grades", gradesRouter);

module.exports = router;
