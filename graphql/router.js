var express = require("express");
var router = express.Router();
// const { graphqlHTTP } = require('express-graphql');
// https://github.com/graphql/express-graphql


router.get('/', function(req, res) {
    res.send("this is the graphql endpoint");
});


module.exports = router;