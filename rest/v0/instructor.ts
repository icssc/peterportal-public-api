import express from 'express';
const router = express.Router();

import { createErrorJSON } from '../../helpers/errors.helper';
import { getAllInstructors, getInstructors } from '../../helpers/instructor.helper';
import { Instructor } from '../../types/types';


router.get("/all", function (req, res, next) {
    if (Object.keys(req.query).length == 0)
        res.json(getAllInstructors());
    else 
        res.status(404).json(createErrorJSON(404, "Not Found", "Invalid Query"));
})

router.get("/:ucinetid", function (req, res, next) {
    const instructors : string[] = req.params.ucinetid.split(";")
    const instructor : Instructor | Instructor[] = getInstructors(instructors);
    instructor ? res.json(instructor) : res.status(404).json(createErrorJSON(404, "Not Found", "Instructor not found"));
})

export default router;