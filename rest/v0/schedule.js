var express = require("express");
var router = express.Router();
var {createErrorJSON} = require("../../helpers/errors.helper")

var {callWebSocAPI} = require('websoc-api');
var {getWeek} = require('../../helpers/week.helper')

router.get("/soc", function (req, res, next) {
    callWebSocAPI(req.query).then((val) => {
        res.json(val)
    }).catch((err) => {
        res.status(400).json(createErrorJSON(400, "Bad Request: Invalid parameter", "Unable to complete websoc-api query"));
    })
})

router.get("/week", function (req, res, next) {
    getWeek(req.query.year, req.query.month, req.query.day).then((val) => {
        res.json(val)
    }).catch((err) => {
        res.status(400).json(createErrorJSON(400, "Bad Request: Invalid parameter", "Invalid year, month or day. Must include all year, month and day or none."));
    })
})

module.exports = router;