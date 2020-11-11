var express = require("express");
var router = express.Router();
var {parseGradesParamsToSQL, queryDatabaseAndResponse} = require('./grades.helper')

// var { apiKeyAuth } = require("../../keys/apiKeyAuth");

router.get("/raw", async function (req, res, next) {
    queryDatabaseAndResponse(parseGradesParamsToSQL(req), false, res)
})

router.get("/calculated", async function (req, res, next) {
    queryDatabaseAndResponse(parseGradesParamsToSQL(req), true, res)
})

module.exports = router;
