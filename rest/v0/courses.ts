import express from 'express';
const router = express.Router();

import { createErrorJSON } from '../../helpers/errors.helper';
import { getAllCourses, getCourse, getBatchCourses } from '../../helpers/courses.helper';
import { Course } from '../../types/types';

router.get("/all", function (req, res, next) {
    if (Object.keys(req.query).length == 0)
        res.json(getAllCourses());
    else if (req.query.course != null)
        res.json(getBatchCourses(req.query.course));
    else
        res.status(404).json(createErrorJSON(404, "Not Found", "Invalid Query"));
        
})

router.get("/:courseID", function (req, res, next) {
    const course : Course = getCourse(req.params.courseID);
    course ? res.json(course) : res.status(404).json(createErrorJSON(404, "Not Found", "Course not found"));
})

export default router
