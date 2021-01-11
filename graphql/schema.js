const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLList
} = require('graphql');

const courses_cache = require('../cache/parsed_courses_cache.json');
const professors_cache = require('../cache/parsed_professor_cache.json')

const professorType = new GraphQLObjectType({
  name: 'Professor',
  fields: () => ({
    name: { type: GraphQLString },
    ucinetid: { type: GraphQLString },
    phone: { type: GraphQLString },
    title: { type: GraphQLString },
    department: { type: GraphQLString },
    schools: { type: GraphQLList(GraphQLString) },
    related_departments: { type: GraphQLList(GraphQLString) },
    course_history: { 
      type: GraphQLList(courseType),
      resolve: (professor) => {
        return professors_cache[professor.ucinetid]["course_history"].map(course_id => courses_cache[course_id.replace(/ /g, "")]);
      }
    }
  })
});

const courseType = new GraphQLObjectType({
  name: 'Course',

  // fields must match schema from database
  // In this case, we're using a .json cache
  fields: () => ({
    id: { type: GraphQLString },
    department: { type: GraphQLString },
    number: { type: GraphQLString },
    school: { type: GraphQLString },
    title: { type: GraphQLString },
    course_level: { type: GraphQLString },
    department_alias: { type: GraphQLList(GraphQLString) },
    units: { type: GraphQLList(GraphQLFloat) },
    description: { type: GraphQLString },
    department_name: { type: GraphQLString },
    professor_history: { 
      type: GraphQLList(professorType),
      resolve: (course) => {
        return courses_cache[course.id.replace(/ /g, "")]["professor_history"].map(professor_netid => professors_cache[professor_netid]);
      } 
    },
    prerequisite_tree: { type: GraphQLString },
    prerequisite_list: { 
      type: GraphQLList(courseType),
      resolve: (course) => {
        return courses_cache[course.id.replace(/ /g, "")]["prerequisite_list"].map(prereq_id => courses_cache[prereq_id.replace(/ /g, "", "")]);
      }
    },
    prerequisite_text: { type: GraphQLString },
    dependencies: { 
      type: GraphQLList(courseType),
      resolve: (course) => {
        return courses_cache[course.id.replace(/ /g, "")]["dependencies"].map(prereq_id => courses_cache[prereq_id.replace(/ /g, "", "")]);
      }
    },
    repeatability: { type: GraphQLString },
    concurrent: { type: GraphQLString },
    same_as: { type: GraphQLString },
    restriction: { type: GraphQLString },
    overlap: { type: GraphQLString },
    corequisite: { type: GraphQLString },
    ge_list: { type: GraphQLList(GraphQLString) },
    ge_text: { type: GraphQLString },
    terms: { type: GraphQLList(GraphQLString) },
    // can't add "same as" or "grading option" due to whitespace :((
  })
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
        return professors_cache[ucinetid];
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
