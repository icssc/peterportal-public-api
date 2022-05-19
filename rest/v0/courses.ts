import express from 'express';
const router = express.Router();

import { createErrorJSON } from '../../helpers/errors.helper';
import { getAllCourses, getCourses } from '../../helpers/courses.helper';
import { Course } from '../../types/types';

router.get("/all", function (req, res, next) {
    if (Object.keys(req.query).length == 0)
        res.json(getAllCourses());
    else
        res.status(404).json(createErrorJSON(404, "Not Found", "Invalid Query"));
        
})

router.get("/:courseID", function (req, res, next) {
    const courses : string[] = req.params.courseID.split(";")
    const course : Course | Course[] = getCourses(courses);
    course ? res.json(course) : res.status(404).json(createErrorJSON(404, "Not Found", "Course not found"));
})

export default router
