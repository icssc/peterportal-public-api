var express = require("express");
var router = express.Router();

var { apiKeyAuth } = require("../../keys/apiKeyAuth");
var {getAllCourses, getSpecificCourse} = require('./courses.helper')

router.get("/:courseID", function (req, res, next) {
    getSpecificCourse(req.params.courseID) ? res.json(getSpecificCourse(req.params.courseID)) : res.status(404).json({"status": 404, "error": "Bad Request: Invalid parameter", "message": "Course not found"});
})

module.exports = router;
