var express = require("express");
var router = express.Router();

var version1Router = require('./v0/router');

router.get('/', function(req, res) {
    res.redirect('/rest/v0');
});

router.use("/v0", version1Router);


module.exports = router;