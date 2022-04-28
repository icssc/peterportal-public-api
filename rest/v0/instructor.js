var express = require("express");
var router = express.Router();

var {createErrorJSON} = require("../../helpers/errors.helper")
var {getAllInstructors, getInstructor, getBatchInstructors} = require('../../helpers/instructor.helper')


router.get("/all", function (req, res, next) {
    if (req.query.instructor != null)
        res.json(getBatchInstructors(req.query.instructor));
    else 
        res.json(getAllInstructors());
})

router.get("/:ucinetid", function (req, res, next) {
    getInstructor(req.params.ucinetid) ? res.json(getInstructor(req.params.ucinetid)) : res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Instructor not found"));
})


module.exports = router;
