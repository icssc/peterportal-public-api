var express = require("express");
var router = express.Router();
var {createErrorJSON} = require("./errors.helper")

var {callWebSocAPI} = require('websoc-api');

router.get("/soc", function (req, res, next) {
    callWebSocAPI(req.query).then((val) => {
        res.json(val)
    }).catch((err) => {
        res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Unable to complete websoc-api query"));
    })
})


module.exports = router;