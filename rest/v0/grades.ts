import express from 'express';
const router = express.Router();

import { createErrorJSON, ValidationError } from '../../helpers/errors.helper';
import { parseGradesParamsToSQL, fetchCalculatedData, fetchGrades } from '../../helpers/grades.helper';
import { GradeCalculatedData, GradeRawData, GradeParams } from '../../types/types';

router.get("/raw", async (req, res) => {
    
    const params = {
        'year': req.query.year,
        'quarter': req.query.quarter,
        'instructor': req.query.instructor,
        'department': req.query.department,
        'number': req.query.number,
        'code': req.query.code ?? null,
        'division': req.query.division,
        'excludePNP': req.query.excludePNP == 'true'
    }

    try {
        const where : GradeParams = parseGradesParamsToSQL(params);
        const results : GradeRawData = fetchGrades(where); // false for raw data
        res.send(results)
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).send(createErrorJSON(
                400, 
                "Bad Request: Invalid syntax in parameters", 
                err.message
            ));
        } else {
            res.status(500).send()
            throw err
        }
    }        
})

router.get("/calculated", async (req, res) => {
    
    const params = {
        'year': req.query.year,
        'quarter': req.query.quarter,
        'instructor': req.query.instructor,
        'department': req.query.department,
        'number': req.query.number,
        'code': req.query.code,
        'division': req.query.division,
        'excludePNP': req.query.excludePNP == 'true'
    }

    try {
        const where : GradeParams = parseGradesParamsToSQL(params);
        const results : GradeCalculatedData = fetchCalculatedData(where) // true for calculated
        res.send(results)
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).send(createErrorJSON(
                400,
                "Bad Request: Invalid syntax in parameters", 
                err.message
            ));
        } else {
            res.status(500).send();
            throw err;
        }
    }   
})

export default router;
