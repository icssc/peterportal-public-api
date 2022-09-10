import express from "express";

import {
  getAllCourses,
  getCourse,
  getCourses,
} from "../../helpers/courses.helper";
import { createErrorJSON } from "../../helpers/errors.helper";
import { Course } from "../../types/types";

const router = express.Router();

router.get("/all", function (req, res, next) {
  res.json(getAllCourses());
});

router.get("/:courseID", function (req, res, next) {
  const courseList: string[] = req.params.courseID.split(";");
  const courses: { [key: string]: Course } | Course =
    courseList.length > 1
      ? getCourses(courseList)
      : getCourse(req.params.courseID);
  courses
    ? res.json(courses)
    : res
        .status(404)
        .json(createErrorJSON(404, "Not Found", "Course not found"));
});

export default router;
