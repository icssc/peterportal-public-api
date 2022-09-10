import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

const weekType: GraphQLObjectType = new GraphQLObjectType({
  name: "Week",
  fields: () => ({
    week: { type: GraphQLInt, description: "School week between 1-10" },
    quarter: { type: GraphQLString, description: "Quarter and year" },
    display: {
      type: GraphQLString,
      description: "Displays the week and quarter formatted",
    },
  }),
});

export { weekType };
