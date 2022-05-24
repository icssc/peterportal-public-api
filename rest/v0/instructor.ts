import express from 'express';
const router = express.Router();

import { createErrorJSON } from '../../helpers/errors.helper';
import { getAllInstructors, getInstructors, getInstructor } from '../../helpers/instructor.helper';
import { Instructor } from '../../types/types';


router.get("/all", function (req, res, next) {
    res.json(getAllInstructors());
})

router.get("/:ucinetid", function (req, res, next) {
    const instructorList : string[] = req.params.ucinetid.split(";")
    const instructors : { [key : string] : Instructor } | Instructor = instructorList.length > 1 ? getInstructors(instructorList) : getInstructor(req.params.ucinetid)
    instructors ? res.json(instructors) : res.status(404).json(createErrorJSON(404, "Not Found", "Instructor not found"));
})

export default router;