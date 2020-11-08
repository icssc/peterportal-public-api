var express = require("express");
var router = express.Router();
var {parseGradesParamsToSQL, queryDatabaseAndResponse} = require('./grades.helper')

// var { apiKeyAuth } = require("../../keys/apiKeyAuth");

router.get("/", async function (req, res, next) {
    queryDatabaseAndResponse(parseGradesParamsToSQL(req), res)
})

module.exports = router;
