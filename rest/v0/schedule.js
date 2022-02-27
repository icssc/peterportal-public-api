var express = require("express");
var router = express.Router();
var {createErrorJSON} = require("../../helpers/errors.helper")

var {callWebSocAPI} = require('websoc-api');
var {getWeek} = require('../../helpers/schedule.helper')

router.get("/soc", function (req, res, next) {
    callWebSocAPI(req.query).then((val) => {
        res.json(val)
    }).catch((err) => {
        res.status(400).json(createErrorJSON(400, "Bad Request: Invalid parameter", "Unable to complete websoc-api query"));
    })
})

router.get("/week", function (req, res, next) {
    getWeek().then((val) => {
        res.json(val)
    }).catch((err) => {
        res.status(400).json(createErrorJSON(400, "Bad Request: Invalid parameter", "Unable to get week"));
    })
})

module.exports = router;