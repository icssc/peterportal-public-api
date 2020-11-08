var express = require("express");
var router = express.Router();

var coursesRouter = require("./courses");
var gradesRouter = require("./grades");
var instructorRouter = require("./instructor");

router.get("/", (req,res) => {
    res.redirect('/docs')
})

router.use("/courses", coursesRouter);
router.use("/instructors", instructorRouter);
router.use("/grades", gradesRouter);

module.exports = router;
