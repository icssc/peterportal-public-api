import express from 'express';
const router = express.Router();

import { createErrorJSON } from '../../helpers/errors.helper';
import { getAllInstructors, getInstructor } from '../../helpers/instructor.helper';
import { Instructor } from '../../types/types';


router.get("/all", function (req, res, next) {
    res.json(getAllInstructors());
})

router.get("/:ucinetid", function (req, res, next) {
    const instructor : Instructor = getInstructor(req.params.ucinetid);
    instructor ? res.json(instructor) : res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Instructor not found"));
})

export default router;