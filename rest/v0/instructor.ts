import express from 'express';
const router = express.Router();

import { createErrorJSON } from '../../helpers/errors.helper';
import { getAllInstructors, getInstructor } from '../../helpers/instructor.helper';


router.get("/all", function (req, res, next) {
    res.json(getAllInstructors());
})

router.get("/:ucinetid", function (req, res, next) {
    getInstructor(req.params.ucinetid) ? res.json(getInstructor(req.params.ucinetid)) : res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Instructor not found"));
})

export default router;