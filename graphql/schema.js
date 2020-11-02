const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLList
} = require('graphql');

const courses_cache = require('../cache/parsed_courses_cache.json');
const professors_cache = require('../cache/professors_cache.json');


const professorType = new GraphQLObjectType({
  name: 'Professor',
  fields: {
    name: { type: GraphQLString },
    ucinetid: { type: GraphQLString },
    phone: { type: GraphQLString },
    title: { type: GraphQLString },
    department: { type: GraphQLString },
    schools: { type: GraphQLList(GraphQLString) },
    relatedDepartments: { type: GraphQLList(GraphQLString) },
    courseHistory: { type: GraphQLList(GraphQLString) }
  }
});

const courseType = new GraphQLObjectType({
  name: 'Course',

  // fields must match schema from database
  // In this case, we're using a .json cache
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
    terms: { type: GraphQLList(GraphQLString) },
    // can't add "same as" or "grading option" due to whitespace :((

    // Using the professor History list, create a list of
    // professor types for more detailed professor history list
    // This helps reduce queries for clients looking for past professor info
    // O(N)
    professorHistoryInfo: {
      type: GraphQLList(professorType),
      resolve: (course) => {
        matches = [];
        for (prevProf of course.professorHistory){
          matches.push(professors_cache["hits"]["hits"].find(prof => prof["_id"] === prevProf)["_source"]);
        }
        return matches;
      }
    }

  }
});


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () =>  ({

    // query course by ID
    course: {
      type: courseType,

      // specify args to query by
      args: {
        id: { type: GraphQLString }
      },

      // define function to get a course
      resolve: (_, {id}) => {
        return courses_cache[id];
      },

      // documentation
      description: "Search courses by their course id. Ex: ICS46."
    },

    // get professor by ucinetid
    professor: {
      type: professorType,

      // specify args to query by (ucinetid)
      args: {
        ucinetid: { type: GraphQLString }
      },

      // define function to get a professor
      resolve: (_, {ucinetid}) => {
        return professors_cache["hits"]["hits"].find(prof => prof["_id"] === ucinetid)["_source"];
      },

      // documentation for professor
      description: "Search professors by their ucinetid"
    },

    // return all courses
    allCourses: {
      type: GraphQLList(courseType),

      // get all courses from courses cache
      resolve: () => {
        var coursesArr = []
        for (var courseId in courses_cache){
          coursesArr.push(courses_cache[courseId]);
        }
        return coursesArr;
      },

      // documentation for all courses
      description: "Return all courses. Takes no arguments"
    },

    // return all professors
    allProfessors: {
      type: GraphQLList(professorType),

      // get all professors from cache
      resolve: () => {
        var profArr = []
        for (prof of professors_cache["hits"]["hits"]){
          profArr.push(prof["_source"])
        }
        return profArr
      },

      // documentation for all professors
      description: "Return all professors. Takes no arguments"
    }
})});


const schema = new GraphQLSchema({query: queryType});

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

"hits":[{"_index":"professors","_type":"_doc","_id":"kakagi","_score":1,"_source":{"name":"Kei Akagi","ucinetid":"kakagi",
  "phone":"(949) 824-2171","title":"Chancellor's Professor","department":"Arts-Music","schools":["Claire Trevor School of the Arts"]

  {
    professor(ucinetid: "kakagi"){
      name
      ucinetid
      phone
      title
      department
      schools
      relatedDepartments
      courseHistory
    }
  }

*/
