var express = require("express");
var router = express.Router();

var {createErrorJSON} = require("./errors.helper")
var { apiKeyAuth } = require("../../keys/apiKeyAuth");
var {getAllCourses, getSpecificCourse} = require('./courses.helper')

router.get("/all", apiKeyAuth, function (req, res, next) {
    res.json(getAllCourses());
})

router.get("/:courseID", function (req, res, next) {
    getSpecificCourse(req.params.courseID) ? res.json(getSpecificCourse(req.params.courseID)) : res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Course not found"));
})

module.exports = router;
