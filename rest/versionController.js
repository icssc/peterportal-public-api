var express = require("express");
var router = express.Router();

var version1Router = require('./v1/router');

router.get('/', function(req, res) {
    res.redirect('/rest/v1');
});

router.use("/v1", version1Router);


module.exports = router;