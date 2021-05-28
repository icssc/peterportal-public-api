var express = require("express");
var router = express.Router();
var coursesRouter = require("./courses");
var gradesRouter = require("./grades");
var instructorRouter = require("./instructor");
var scheduleRouter = require("./schedule");
const compression = require("compression")
var {createErrorJSON} = require("../../helpers/errors.helper")

router.get("/", (req,res) => {
    res.redirect('/docs')
})

router.use("/courses", coursesRouter);
router.use("/instructors", instructorRouter);
router.use("/grades", compression(), gradesRouter);
router.use("/schedule", scheduleRouter);
router.use("*", (req, res) => {
    res.status(404).send(createErrorJSON(404, "Not Found", "The requested resource was not found."))
});

module.exports = router;
