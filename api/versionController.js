var express = require("express");
var router = express.Router();

var version1Router = require('./v1/v1');
var generateKey = require('./generateKey');

router.get('/', function(req, res) {
    res.redirect('/api/v1');
});

router.use("/v1", version1Router);
router.use("/generateKey", generateKey);


module.exports = router;