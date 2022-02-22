import express from 'express';
const router = express.Router();

import { createErrorJSON } from '../../helpers/errors.helper';
import { getAllCourses, getCourse } from '../../helpers/courses.helper';

router.get("/all", function (req, res, next) {
    res.json(getAllCourses());
})

router.get("/:courseID", function (req, res, next) {
    getCourse(req.params.courseID) ? res.json(getCourse(req.params.courseID)) : res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Course not found"));
})

export default router;
