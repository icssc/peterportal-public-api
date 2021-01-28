var express = require("express");
var router = express.Router();
var {createErrorJSON} = require("./errors.helper")

var {callWebSocAPI} = require('websoc-api');

router.get("/soc", function (req, res, next) {
    // console.log('req', process.env.NODE_ENV);
    callWebSocAPI(req.query).then((val) => {
        res.json(val)
        console.log('result', val);
    }).catch((err) => {
        console.log('your error: ', err);
        // res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Unable to complete websoc-api query"))
        // .catch(() => {
        //     console.log("bad request in websoc API");
        // })
    })
})


module.exports = router;