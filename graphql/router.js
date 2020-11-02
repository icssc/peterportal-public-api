const express = require("express");
const { graphqlHTTP } = require('express-graphql');

const { schema } = require('./schema');

const router = express.Router();



router.use('/', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));



module.exports = router;
