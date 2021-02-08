var express = require("express");
var router = express.Router();
var {parseGradesParamsToSQL, queryDatabaseAndResponse} = require('../../helpers/grades.helper')

router.get("/raw", async (req, res) => {
    try {
        const where = parseGradesParamsToSQL(req.query);
        const results = queryDatabaseAndResponse(where, false)
        res.send(results)
    } catch (err) {
        res.status(err.status).send(err);
    }        
})

router.get("/calculated", async (req, res) => {
    try {
        const where = parseGradesParamsToSQL(req.query);
        const results = queryDatabaseAndResponse(where, true)
        res.send(results)
    } catch (err) {
        res.status(err.status).send(err);
    }   
})

module.exports = router;
