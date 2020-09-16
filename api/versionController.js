var express = require("express");
var router = express.Router();

var version1Router = require('./v1/router');
var generateKey = require('./generateKey');

router.get('/', function(req, res) {
    res.redirect('/v1');
});

router.use("/v1", version1Router);
router.use("/generateKey", generateKey);


module.exports = router;