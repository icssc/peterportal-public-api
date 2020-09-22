const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');


const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!';
  },
};



module.exports = {schema, root};
