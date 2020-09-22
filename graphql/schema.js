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
    department: { type: GraphQLString }
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
        return cache[id]
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
