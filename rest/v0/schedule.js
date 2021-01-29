var express = require("express");
var router = express.Router();
var {createErrorJSON} = require("./errors.helper")

var {callWebSocAPI} = require('websoc-api');

router.get("/soc", function (req, res, next) {
    callWebSocAPI(req.query).then((val) => {
        // The following console.log works, but setting the response does not
        // Something occurs with the credentials
        // console.log('result', val);
        res.json(val)
        
    }).catch((err) => {
        console.log('your error: ', err);
        // res.status(404).json(createErrorJSON(404, "Bad Request: Invalid parameter", "Unable to complete websoc-api query"));
    })
})


module.exports = router;