var express = require("express");
var router = express.Router();

// scale for multiple versions
var version1Router = require('./v1/v1');
var version2Router = require('./v2/v2');

router.get('/', function(req, res) {
    res.redirect('/api/v1');
});

router.use("/v1", version1Router);
router.use("/v2", version2Router);

module.exports = router;