const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLList
} = require('graphql');

var {getAllCourses, getCourse} = require('../helpers/courses.helper')
var {getAllInstructors, getInstructor} = require('../helpers/instructor.helper')
var {parseGradesParamsToSQL, queryDatabaseAndResponse} = require('../helpers/grades.helper')

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
        return getInstructor(professor.ucinetid)["course_history"].map(course_id => getCourse(course_id.replace(/ /g, "")));
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
        return getCourse(course.id.replace(/ /g, ""))["professor_history"].map(professor_netid => getInstructor(professor_netid));
      } 
    },
    prerequisite_tree: { type: GraphQLString },
    prerequisite_list: { 
      type: GraphQLList(courseType),
      resolve: (course) => {
        return getCourse(course.id.replace(/ /g, ""))["prerequisite_list"].map(prereq_id => getCourse(prereq_id.replace(/ /g, "", "")));
      }
    },
    prerequisite_text: { type: GraphQLString },
    prerequisite_for: { 
      type: GraphQLList(courseType),
      resolve: (course) => {
        return getCourse(course.id.replace(/ /g, ""))["prerequisite_for"].map(prereq_id => getCourse(prereq_id.replace(/ /g, "", "")));
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

const courseOfferingType = new GraphQLObjectType({
  name: "CourseOffering",

  fields: () => ({
    year: { type: GraphQLString },
    quarter: { type: GraphQLString },
    code: { type: GraphQLFloat },
    section: { type: GraphQLString },
    type: { type: GraphQLString },
    instructor: { type: GraphQLString },  // TODO: map name to professorType
    course: { 
      type: courseType,
      resolve: (temp) => {
        return getCourse(temp.course)
      }
    }
  })
})

const gradeDistributionType = new GraphQLObjectType({
  name: "GradeDistribution",

  fields: () => ({
    grade_a_count: { type: GraphQLFloat }, 
    grade_b_count: { type: GraphQLFloat }, 
    grade_c_count: { type: GraphQLFloat }, 
    grade_d_count: { type: GraphQLFloat }, 
    grade_f_count: { type: GraphQLFloat }, 
    grade_p_count: { type: GraphQLFloat }, 
    grade_np_count: { type: GraphQLFloat }, 
    grade_w_count: { type: GraphQLFloat }, 
    average_gpa: { type: GraphQLFloat },
    course_offering: { type: courseOfferingType }
  })
});

const gradeDistributionCollectionAggregateType = new GraphQLObjectType({
  name: "GradeDistributionCollectionAggregate",

  fields: () => ({
    sum_grade_a_count: { type: GraphQLFloat }, 
    sum_grade_b_count: { type: GraphQLFloat }, 
    sum_grade_c_count: { type: GraphQLFloat }, 
    sum_grade_d_count: { type: GraphQLFloat }, 
    sum_grade_f_count: { type: GraphQLFloat }, 
    sum_grade_p_count: { type: GraphQLFloat }, 
    sum_grade_np_count: { type: GraphQLFloat }, 
    sum_grade_w_count: { type: GraphQLFloat }, 
    average_gpa: { type: GraphQLFloat }
  })
});

const gradeDistributionCollectionType = new GraphQLObjectType({
  name: 'GradeDistributionCollection',

  fields: () => ({
    aggregate: { type: gradeDistributionCollectionAggregateType },
    grade_distributions: {type: GraphQLList(gradeDistributionType)}
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
        id: { type: GraphQLString, description: "Course Department concatenated with Course Number. Ex: COMPSCI161" }
      },

      // define function to get a course
      resolve: (_, {id}) => {
        return getCourse(id);
      },

      // documentation
      description: "Search courses by their course id. Ex: COMPSCI161"
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
        return getInstructor(ucinetid);
      },

      // documentation for professor
      description: "Search professors by their ucinetid"
    },

    // return all courses
    allCourses: {
      type: GraphQLList(courseType),

      // get all courses from courses cache
      resolve: () => {
        return getAllCourses()
      },

      // documentation for all courses
      description: "Return all courses. Takes no arguments"
    },

    // return all professors
    allProfessors: {
      type: GraphQLList(professorType),

      // get all professors from cache
      resolve: () => {
        return getAllInstructors();
      },

      // documentation for all professors
      description: "Return all professors. Takes no arguments"
    },

    grades: {
      type: gradeDistributionCollectionType,

      args: {
        year: { type: GraphQLString },
        quarter: { type: GraphQLString },
        instructor: { type: GraphQLString },
        department: { type: GraphQLString },
        number: { type: GraphQLString },
        code: { type: GraphQLFloat }
      },

      resolve: (_, args) => {
        // Send request to rest
        var query = {
            ... args
        }
        const where = parseGradesParamsToSQL(query);
        const gradeResults = queryDatabaseAndResponse(where, false)
        const aggregateResult = queryDatabaseAndResponse(where, true).gradeDistribution
    
        // Format to GraphQL
        let aggregate = {
          sum_grade_a_count: aggregateResult['SUM(gradeACount)'],
          sum_grade_b_count: aggregateResult['SUM(gradeBCount)'],
          sum_grade_c_count: aggregateResult['SUM(gradeCCount)'],
          sum_grade_d_count: aggregateResult['SUM(gradeDCount)'],
          sum_grade_f_count: aggregateResult['SUM(gradeFCount)'],
          sum_grade_p_count: aggregateResult['SUM(gradePCount)'],
          sum_grade_np_count: aggregateResult['SUM(gradeNPCount)'],
          sum_grade_w_count: aggregateResult['SUM(gradeWCount)'],
          average_gpa: aggregateResult['AVG(averageGPA)']
        }

        let gradeDistributions = gradeResults.map(result => {
          return {
            grade_a_count: result.gradeACount,
            grade_b_count: result.gradeBCount,
            grade_c_count: result.gradeCCount,
            grade_d_count: result.gradeDCount,
            grade_f_count: result.gradeFCount,
            grade_p_count: result.gradePCount,
            grade_np_count: result.gradeNPCount,
            grade_w_count: result.gradeWCount,
            average_gpa: result.averageGPA != "nan"? result.averageGPA : null,
            course_offering: {
              year: result.year,
              quarter: result.quarter,
              code: result.code,
              section: result.section,
              type: result.type,
              instructor: result.instructor,
              course: result.department.replace(/\s/g, '')+result.number,
            }
          }
        })
        
        let result = {
          aggregate: aggregate,
          grade_distributions: gradeDistributions
        }
        
        return result;
      },

      description: "Search for grades."
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
      prerequisite_for
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
