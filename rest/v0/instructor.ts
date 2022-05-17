import express from 'express';
const router = express.Router();

import { createErrorJSON } from '../../helpers/errors.helper';
import { getAllInstructors, getInstructor, getBatchInstructors } from '../../helpers/instructor.helper';
import { Instructor } from '../../types/types';


router.get("/all", function (req, res, next) {
    if (Object.keys(req.query).length == 0)
        res.json(getAllInstructors());
    else if (req.query.instructor != null)
        res.json(getBatchInstructors(req.query.instructor));
    else 
        res.status(404).json(createErrorJSON(404, "Not Found", "Invalid Query"));
})

router.get("/:ucinetid", function (req, res, next) {
    const instructor : Instructor = getInstructor(req.params.ucinetid);
    instructor ? res.json(instructor) : res.status(404).json(createErrorJSON(404, "Not Found", "Instructor not found"));
})

export default router;