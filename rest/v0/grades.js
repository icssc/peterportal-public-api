var express = require("express");
var router = express.Router();
var {createErrorJSON} = require("../../helpers/errors.helper")
var {parseGradesParamsToSQL, queryDatabaseAndResponse} = require('../../helpers/grades.helper')

router.get("/raw", async (req, res) => {
    try {
        const where = parseGradesParamsToSQL(req.query);
        const results = queryDatabaseAndResponse(where, false)
        res.send(results)
    } catch (err) {
        if (err.name === "ValidationError") {
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
    
    try {
        req.query.excludePNP = (req.query.excludePNP == 'true') ? true : false // converting excludePNP string -> bool
        const where = parseGradesParamsToSQL(req.query);
        const results = queryDatabaseAndResponse(where, true)
        res.send(results)
    } catch (err) {
        if (err.name === "ValidationError") {
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

module.exports = router;
