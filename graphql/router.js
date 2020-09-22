const express = require("express");
const { graphqlHTTP } = require('express-graphql');

const { schema, root } = require('./schema');

const router = express.Router();



router.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));



module.exports = router;
