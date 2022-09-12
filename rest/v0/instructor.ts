import express from "express";

import { createErrorJSON } from "../../helpers/errors.helper";
import {
  getAllInstructors,
  getInstructor,
  getInstructors,
} from "../../helpers/instructor.helper";
import { Instructor } from "../../types/types";

const router = express.Router();

router.get("/all", function (req, res) {
  res.json(getAllInstructors());
});

router.get("/:ucinetid", function (req, res) {
  const instructorList: string[] = req.params.ucinetid.split(";");
  const instructors: { [key: string]: Instructor } | Instructor =
    instructorList.length > 1
      ? getInstructors(instructorList)
      : getInstructor(req.params.ucinetid);
  instructors
    ? res.json(instructors)
    : res
        .status(404)
        .json(createErrorJSON(404, "Not Found", "Instructor not found"));
});

export default router;
