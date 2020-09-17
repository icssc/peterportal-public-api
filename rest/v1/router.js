var express = require("express");
var router = express.Router();

var coursesRouter = require("./courses");
var docRouter = require("../docs/docs")

router.get("/", (req,res) => {
    res.redirect('/rest/v1/docs')
})

router.use("/docs", docRouter);

router.use("/courses", coursesRouter);

module.exports = router;
