var express = require("express");
var router = express.Router();

var {createErrorJSON} = require("../../helpers/errors.helper")
var {getAllCourses, getCourse, getBatchCourses} = require('../../helpers/courses.helper')

router.get("/all", function (req, res, next) {
    if (req.query.course != null)
        res.json(getBatchCourses(req.query.course));
    else
        res.json(getAllCourses());
})

router.get("/:courseID", function (req, res, next) {
    getCourse(req.params.courseID) ? res.json(getCourse(req.params.courseID)) : res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Course not found"));
})

module.exports = router;
