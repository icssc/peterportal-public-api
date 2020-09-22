const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLList
} = require('graphql');

const cache = require('../cache/parsed_courses_cache.json')


const courseType = new GraphQLObjectType({
  name: 'Course',
  fields: {
    id: { type: GraphQLString },
    id_department: { type: GraphQLString },
    id_number: { type: GraphQLString },
    id_school: { type: GraphQLString },
    name: { type: GraphQLString },
    course_level: { type: GraphQLString },
    dept_alias: { type: GraphQLList(GraphQLString) },
    units: { type: GraphQLList(GraphQLFloat) },
    description: { type: GraphQLString },
    department: { type: GraphQLString },
    professorHistory: { type: GraphQLList(GraphQLString) },
    prerequisiteJSON: { type: GraphQLString },
    prerequisiteList: { type: GraphQLList(GraphQLString) },
    prerequisite: { type: GraphQLString },
    dependencies: { type: GraphQLList(GraphQLString) },
    repeatability: { type: GraphQLString },
    concurrent: { type: GraphQLString },
    restriction: { type: GraphQLString },
    overlaps: { type: GraphQLString },
    corequisite: { type: GraphQLString },
    ge_types: { type: GraphQLList(GraphQLString) },
    ge_string: { type: GraphQLString },
    terms: { type: GraphQLList(GraphQLString) }
    // can't add "same as" or "grading option" due to whitespace :((
  }
});


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () =>  ({
    course: {
      type: courseType,

      args: {
        id: { type: GraphQLString }
      },
      resolve: (_, {id}) => {
        return cache[id];
      }
    },


    allCourses: {
      type: GraphQLList(courseType),

      resolve: () => {
        var coursesArr = []
        console.log('getting courses list')
        for (var courseId in cache){
          coursesArr.push(cache[courseId]);
          console.log(courseId);
        }
        return coursesArr


      }
    }
  })
});


const schema = new GraphQLSchema({query: queryType})

module.exports = {schema};

/*
Example:
  query {
    allCourses{
      id
      name
      department
      units
      description
      department
      professorHistory
      prerequisiteJSON
      prerequisiteList
      prerequisite
      dependencies
      repeatability
      concurrent
      restriction
      overlaps
      corequisite
      ge_types
      ge_string
      terms
    }
  }
*/
