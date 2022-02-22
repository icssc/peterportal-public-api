import express from 'express';
const router = express.Router();

import { createErrorJSON } from '../../helpers/errors.helper';
import { getAllCourses, getCourse } from '../../helpers/courses.helper';
import { Course } from '../../types/types';

router.get("/all", function (req, res, next) {
    res.json(getAllCourses());
})

router.get("/:courseID", function (req, res, next) {
    const course : Course = getCourse(req.params.courseID);
    course ? res.json(course) : res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Course not found"));
})

export default router;
