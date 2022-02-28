const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLList,
  GraphQLScalarType,
  GraphQLNonNull,
  GraphQLBoolean
} = require('graphql');
const {
	parseResolveInfo,
} = require('graphql-parse-resolve-info');


var {getAllCourses, getCourse} = require('../helpers/courses.helper')
var {getAllInstructors, getInstructor, getUCINetIDFromName} = require('../helpers/instructor.helper')
var {getCourseSchedules} = require("../helpers/schedule.helper")
var {parseGradesParamsToSQL, fetchAggregatedGrades, fetchInstructors, fetchGrades} = require('../helpers/grades.helper');
const { ValidationError } = require('../helpers/errors.helper');

const instructorType = new GraphQLObjectType({
  name: 'Instructor',
  fields: () => ({
    name: { type: GraphQLString },
    shortened_name: { 
      type: GraphQLString, 
      description: "Name as it appears on webreg. Follows the format: `DOE, J.`",
      resolve: (instructor) => {
        if (instructor.shortened_name) {
          return instructor.shortened_name
        } else {
          // If the shortened_name wasn't provided, 
          // we can construct it from the name.
          const name_parts = instructor.name.split(' ');
          return `${name_parts[name_parts.length-1]}, ${name_parts[0][0]}.`.toUpperCase()
        }
      }
    },
    ucinetid: { type: GraphQLString },
    email: {type: GraphQLString },
    title: { type: GraphQLString },
    department: { type: GraphQLString },
    schools: { type: GraphQLList(GraphQLString) },
    related_departments: { type: GraphQLList(GraphQLString) },
    course_history: { 
      type: GraphQLList(courseType),
      resolve: (instructor) => {
        return getInstructor(instructor.ucinetid)["course_history"].map(course_id => getCourse(course_id.replace(/ /g, "")));
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
    instructor_history: { 
      type: GraphQLList(instructorType),
      resolve: (course) => {
        return course.professor_history.map(instructor_netid => getInstructor(instructor_netid));
      } 
    },
    prerequisite_tree: { type: GraphQLString },
    prerequisite_list: { 
      type: GraphQLList(courseType),
      resolve: (course) => {
        return course.prerequisite_list.map(prereq_id => getCourse(prereq_id.replace(/ /g, "", "")));
      }
    },
    prerequisite_text: { type: GraphQLString },
    prerequisite_for: { 
      type: GraphQLList(courseType),
      resolve: (course) => {
        return course.prerequisite_for.map(prereq_id => getCourse(prereq_id.replace(/ /g, "", "")));
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

    offerings: {
      type: GraphQLList(courseOfferingType),
      args: {
        year: { type: GraphQLFloat},
        quarter: { type: GraphQLString},
        ge: { type: GraphQLString},
        division: { type: GraphQLString},
        section_codes: { type: GraphQLString },
        instructor: { type: GraphQLString },
        section_type: { type: GraphQLString },
        units: { type: GraphQLString },
        days: { type: GraphQLString },
        start_time: { type: GraphQLString },
        end_time: { type: GraphQLString },
        max_capacity: { type: GraphQLString },
        full_courses: { type: GraphQLString },
        cancelled_courses: { type: GraphQLString },
        building: { type: GraphQLString },
        room: { type: GraphQLString }
      },
      resolve: async (course, args, _, info) => {
        if ('offerings' in course) {
          return course.offerings;
        }

        // Only fetch course schedule if it's a root course query.
        // This is because we don't want to spam webreg with successive calls from
        // queries like allCourses/allProfessors.
        const prev_path_type = info.path.prev.typename;

        if (prev_path_type == 'Query'){
          const query = scheduleArgsToQuery({
            department: course.department,
            course_number: course.number, 
            ...args
          })
          const results = await getCourseSchedules(query);
          return results;
        }

        // TODO: only return one error for a query, instead of one per item in the list
        throw new Error(`Accessing a course's offerings from a nested list is not allowed. Please use the schedules query`)
      }
    }
  })
});

const meetingType = new GraphQLObjectType({
  name: "Meeting",

  fields: () => ({
    building: { 
      type: GraphQLString,
      resolve: (meeting) => {
        return meeting["bldg"];
      }
    },
    days: { type: GraphQLString },
    time: { type: GraphQLString }
  })
})

const sectionInfoType = new GraphQLObjectType({
  name: "SectionInfo",
  fields: () => ({
    code: { type: GraphQLString },
    comment: { type: GraphQLString },
    number: { type: GraphQLString },
    type: { type: GraphQLString }
  })
})

const courseOfferingType = new GraphQLObjectType({
  name: "CourseOffering",

  fields: () => ({
    year: { type: GraphQLString },
    quarter: { type: GraphQLString },
    instructors: { 
      type: GraphQLList(instructorType),
      resolve: (offering) => {
        return offering.instructors.map((name) => {
          
          //Fetch all possible ucinetids from the instructor.
          let ucinetids = getUCINetIDFromName(name);
          
          //If only one ucinetid exists and it's in the instructor cache, 
          //then we can return the instructor for it.
          if (ucinetids && ucinetids.length == 1) { 
            const instructor = getInstructor(ucinetids[0]);
            if (instructor) { return instructor; }
          }
          
          //If there is more than one and the course exists, 
          //use the course to figure it out.
          else if (ucinetids && ucinetids.length > 1 && (course = offering.course)) {

              //Filter our instructors by those with related departments.
              let course_dept = course.department;
              let instructors = ucinetids.map(id => getInstructor(id)).filter( temp => temp.related_departments.includes(course_dept));
              
              //If only one is left and it's in the instructor cache, we can return it.
              if (instructors.length == 1) {
                return instructors[0];
              } else {
                //Filter instructors by those that taught the course before.
                instructors = instructors.filter( inst => {
                  return history = inst.course_history.map((course) => course.replace(/ /g, "")).includes(offering.course.id);
                });
              
                //If only one is left and it's in the instructor cache, we can return it.
                if (instructors.length == 1) { 
                  return instructors[0];
                }
              }
          }
          
          //If we haven't found any instructors, then just return the shortened name.
          return {shortened_name: name};
        })
      }
    }, 
    final_exam: { type: GraphQLString },
    max_capacity: { type: GraphQLFloat },
    meetings: { type: GraphQLList(meetingType) },
    num_section_enrolled: { type: GraphQLFloat },
    num_total_enrolled: { type: GraphQLFloat },
    num_new_only_reserved: { type: GraphQLFloat },
    num_on_waitlist: { 
      type: GraphQLFloat, 
      resolve: (offering) => {
         return offering.num_on_waitlist === 'n/a' ? null : offering.num_on_waitlist;
        } 
    },
    num_requested: { type: GraphQLFloat },
    restrictions: { type: GraphQLString },
    section: { type: sectionInfoType },  
    status: { type: GraphQLString },
    units: { type: GraphQLFloat },
    course: { 
      type: courseType,
      resolve: (offering) => {
        // Get the course from the cache.
        const course = getCourse(offering.course.id);
        // If it's not in our cache, return whatever information was provided.
        // Usually, it will at least have id, department, and number
        return course ? course : offering.course;
      }
    }
  })
})

// Validate Schedule Query Arguments
function validateScheduleArgs(args) {
  // Assert that a term is provided (year and quarter)
  // year and quarter are non-nullable, so they should never be false
  if (!(args.year && args.quarter)) {
    throw new ValidationError("Must provdide both a year and a quarter.");
  }
  // Assert that GE, Department, Section Codes, or Instructor is provided
  if (!(args.ge || args.department || args.section_codes || args.instructor)){
    throw new ValidationError("Must specify at least one of the following: ge, department, section_codes, or instructor.")
  }
}

// Format Schedule query arguments for WebSoc
function scheduleArgsToQuery(args) {
  const { year, quarter, ge, department, course_number, division, section_codes, instructor, course_title, section_type, units, days, start_time, end_time, max_capacity, full_courses, cancelled_courses, building, room} = args
  return {
    term: year + " " + quarter,
    ge: ge,
    department: department,
    courseNumber: course_number,
    division: division,
    sectionCodes: section_codes,
    instructorName: instructor,
    courseTitle: course_title,
    sectionType: section_type,
    units: units,
    days: days,
    startTime: start_time,
    endTime: end_time,
    maxCapacity: max_capacity,
    fullCourses: full_courses,
    cancelledCourses: cancelled_courses,
    building: building,
    room: room,
  }
}

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
    average_gpa: { type: GraphQLFloat },
    count: { type: GraphQLFloat }
  })
});

const gradeDistributionCollectionType = new GraphQLObjectType({
  name: 'GradeDistributionCollection',

  fields: () => ({
    aggregate: { type: gradeDistributionCollectionAggregateType },
    grade_distributions: {type: GraphQLList(gradeDistributionType)},
    instructors: { 
      type: GraphQLList(GraphQLString),
      description: "List of instructors present in the Grade Distribution Collection" 
    }
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
        id: { type: GraphQLNonNull(GraphQLString), description: "Course Department concatenated with Course Number. Ex: COMPSCI161" }
      },

      // define function to get a course
      resolve: (_, {id}) => {
        return getCourse(id);
      },

      // documentation
      description: "Search courses by their course id. Ex: COMPSCI161"
    },

    // get instructor by ucinetid
    instructor: {
      type: instructorType,

      // specify args to query by (ucinetid)
      args: {
        ucinetid: { type: GraphQLNonNull(GraphQLString) }
      },

      // define function to get a instructor
      resolve: (_, {ucinetid}) => {
        return getInstructor(ucinetid);
      },

      // documentation for instructor
      description: "Search instructors by their ucinetid"
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

    // return all instructor
    allInstructors: {
      type: GraphQLList(instructorType),

      // get all instructors from cache
      resolve: () => {
        return getAllInstructors();
      },

      // documentation for all instructors
      description: "Return all instructors. Takes no arguments"
    },

    schedule: {
      type: GraphQLList(courseOfferingType),

      args: {
        year: { type: GraphQLNonNull(GraphQLFloat), description: "Year of the term. Required." },
        quarter: { type: GraphQLNonNull(GraphQLString), description: "Quarter of the term. ['Fall'|'Winter'|'Spring'|'Summer1'|'Summer2'|'Summer10wk']. Required." },
        ge: { type: GraphQLString, description: "GE type. ['ANY'|'GE-1A'|'GE-1B'|'GE-2'|'GE-3'|'GE-4'|'GE-5A'|'GE-5B'|'GE-6'|'GE-7'|'GE-8']." },
        department: { type: GraphQLString, description: "Department Code." },
        course_number: { type: GraphQLString, description: "Course number or range. Ex: '32A' or '31-33'." },
        division: { type: GraphQLString, description: "Division level of a course. ['ALL'|'LowerDiv'|'UpperDiv'|'Graduate']. Default: 'ALL'." },
        section_codes: { type: GraphQLString, description: "5-digit course code or range. Ex: '36531' or '36520-36536'." },
        instructor: { type: GraphQLString, description: "Instructor last name or part of last name." },
        course_title: { type: GraphQLString, description: "Title of a course." },
        section_type: { type: GraphQLString, description: "Type of section. ['ALL'|'ACT'|'COL'|'DIS'|'FLD'|'LAB'|'LEC'|'QIZ'|'RES'|'SEM'|'STU'|'TAP'|'TUT']. Default: 'ALL'." },
        units: { type: GraphQLString, description: "Unit count of a course. Ex: '4' or '1.3'. Use 'VAR' to look for variable unit classes." },
        days: { type: GraphQLString, description: "Days that a course is offered. Any combination of ['Su'|'M'|'T'|'W'|'Th'|'F'|'Sa']. Ex: 'MWF'." },
        start_time: { type: GraphQLString, description: "Start time of a couse in 12 hour format. Ex: '10:00AM' or '5:00PM'" },
        end_time: { type: GraphQLString, description: "End time of a couse in 12 hour format. Ex: '10:00AM' or '5:00PM'" },
        max_capacity: { type: GraphQLString, description: "Maximum enrollment capacity of a choice. Specify a " },
        full_courses: { type: GraphQLString, description: "Status of a course's enrollment state. ['ANY'|'SkipFullWaitlist'|'FullOnly'|'OverEnrolled']. Default: 'ANY'." },
        cancelled_courses: { type: GraphQLString, description: "Indicate whether to ['Exclude'|'Include'|'Only'] cancelled courses. Default: 'EXCLUDE'." },
        building: { type: GraphQLString, description: "Building code found on https://www.reg.uci.edu/addl/campus/." },
        room: { type: GraphQLString, description: "Room number in a building. Must also specify a building code." }
      },

      resolve: async (_, args) => {
        validateScheduleArgs(args)
        const query = scheduleArgsToQuery(args);
        const results = await getCourseSchedules(query);
        return results
      },

      description: "Return schedule from websoc."
    },

    grades: {
      type: gradeDistributionCollectionType,

      args: {
        year: { type: GraphQLString, description: "Must be <START_YEAR>-<END_YEAR>. Ex. 2020-2021. Multiple values in the arguments can be included by using ; as a separator."},
        quarter: { type: GraphQLString, description: "Fall | Winter | Spring | Summer Multiple values in the arguments can be included by using ; as a separator."},
        instructor: { type: GraphQLString, description: "Instructor, must following the format (<last_name>, <first_initial>.) Multiple values in the arguments can be included by using ; as a separator."},
        department: { type: GraphQLString, description: "Department short-hand. Ex. COMPSCI. Multiple values in the arguments can be included by using ; as a separator."},
        number: { type: GraphQLString, description: "Course number. Multiple values in the arguments can be included by using ; as a separator."},
        code: { type: GraphQLString, description: "5-digit course code on WebSoC. Multiple values in the arguments can be included by using ; as a separator." }, 
        division: { type: GraphQLString, description: "Filter by Course Level ('LowerDiv'|'UpperDiv')"},
        excludePNP: { type: GraphQLBoolean, description: "Exclude P/NP Only courses" }
      },

      resolve: (_, args, __, info) => {
        // Get the fields requested in the query
        // This allows us to only fetch what the client wants from sql

        const requestedFields = Object.keys(parseResolveInfo(info).fieldsByTypeName.GradeDistributionCollection)
      
        // Construct a WHERE clause from the arguments
        const where = parseGradesParamsToSQL(args);
        
        // If requested, retrieve the grade distributions
        let grade_distributions, gradeResults;
        if (requestedFields.includes('grade_distributions')) {
          gradeResults = fetchGrades(where)

          // Format the results to GraphQL
          grade_distributions = gradeResults.map(result => {
            return {
              grade_a_count: result.gradeACount,
              grade_b_count: result.gradeBCount,
              grade_c_count: result.gradeCCount,
              grade_d_count: result.gradeDCount,
              grade_f_count: result.gradeFCount,
              grade_p_count: result.gradePCount,
              grade_np_count: result.gradeNPCount,
              grade_w_count: result.gradeWCount,
              average_gpa: (result.averageGPA && result.averageGPA !== "nan") ? result.averageGPA : null,
              course_offering: {
                year: result.year,
                quarter: result.quarter,
                section: {
                  code: result.code,
                  number: result.section,
                  type: result.type,
                },
                instructors: [result.instructor],
                course: {
                  id: result.department.replace(/\s/g, '')+result.number,
                  department: result.department,
                  number: result.number,
                  department_name: result.department_name,
                  title: result.title
                }
              }
            }
          })
        }
        
        // If requested, retrieve the aggregate
        let aggregate;
        if (requestedFields.includes('aggregate')) {
          const aggregateResult = fetchAggregatedGrades(where)
          // Format results to GraphQL
          aggregate = {
            sum_grade_a_count: aggregateResult['sum_grade_a_count'],
            sum_grade_b_count: aggregateResult['sum_grade_b_count'],
            sum_grade_c_count: aggregateResult['sum_grade_c_count'],
            sum_grade_d_count: aggregateResult['sum_grade_d_count'],
            sum_grade_f_count: aggregateResult['sum_grade_f_count'],
            sum_grade_p_count: aggregateResult['sum_grade_p_count'],
            sum_grade_np_count: aggregateResult['sum_grade_np_count'],
            sum_grade_w_count: aggregateResult['sum_grade_w_count'],
            average_gpa: aggregateResult['average_gpa'],
            count: aggregateResult['count']
          }
        }
        // If requested, retrieve the instructors
        let instructors
        if (requestedFields.includes('instructors')) {
          if (gradeResults) {
            // If the grade results exist, we can get the instructors from there
            instructors = [...new Set(gradeResults.map(result => result.instructor))]
          } else {
            // Else query sql for the instructors
            instructors = fetchInstructors(where)
          }
        }
        
        // Return results
        return {
          aggregate,
          grade_distributions,
          instructors
        }
      },

      description: "Search for grade distributions. Multiple values in the arguments can be included by using ; as a separator. "
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
  "title":"Chancellor's Professor","department":"Arts-Music","schools":["Claire Trevor School of the Arts"]

  {
    professor(ucinetid: "kakagi"){
      name
      ucinetid
      title
      department
      schools
      relatedDepartments
      courseHistory
    }
  }

*/
