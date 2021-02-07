var express = require("express");
var router = express.Router();
var {parseGradesParamsToSQL, queryDatabaseAndResponse} = require('../../helpers/grades.helper')

// var { apiKeyAuth } = require("../../keys/apiKeyAuth");

router.get("/raw", async function (req, res, next) {
    const where = parseGradesParamsToSQL(req, res);
    if (!res.headersSent) //check if error msg already sent
        queryDatabaseAndResponse(where, false, res)
})

router.get("/calculated", async function (req, res, next) {
    const where = parseGradesParamsToSQL(req, res);
    if (!res.headersSent) //check if error msg already sent
        queryDatabaseAndResponse(where, true, res)
})

module.exports = router;
