import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLBoolean } from 'graphql'
import { parseResolveInfo } from 'graphql-parse-resolve-info';

import { courseType } from "./course";
import { instructorType } from "./instructor";
import { gradeDistributionCollectionType } from "./grades";
import { validateScheduleArgs, courseOfferingType } from './schedule';

import { getAllCourses, getCourse } from '../helpers/courses.helper';
import { getAllInstructors, getInstructor } from '../helpers/instructor.helper';
import { getCourseSchedules, scheduleArgsToQuery } from '../helpers/schedule.helper';
import { parseGradesParamsToSQL, fetchAggregatedGrades, fetchInstructors, fetchGrades } from '../helpers/grades.helper';
import { GradeDist, GradeRawData } from '../types/types';
import { CourseGQL, CourseOffering } from "../types/websoc.types";


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () =>  ({

    // query course by ID
    course: {
      type: courseType,

      // specify args to query by
      args: {
        id: { type: new GraphQLNonNull(GraphQLString), description: "Course Department concatenated with Course Number. Ex: COMPSCI161" }
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
        ucinetid: { type: new GraphQLNonNull(GraphQLString) }
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
      type: new GraphQLList(courseType),

      // get all courses from courses cache
      resolve: () => {
        return getAllCourses()
      },

      // documentation for all courses
      description: "Return all courses. Takes no arguments"
    },

    // return all instructor
    allInstructors: {
      type: new GraphQLList(instructorType),

      // get all instructors from cache
      resolve: () => {
        return getAllInstructors();
      },

      // documentation for all instructors
      description: "Return all instructors. Takes no arguments"
    },

    schedule: {
      type: new GraphQLList(courseOfferingType),

      args: {
        year: { type: new GraphQLNonNull(GraphQLFloat), description: "Year of the term. Required." },
        quarter: { type: new GraphQLNonNull(GraphQLString), description: "Quarter of the term. ['Fall'|'Winter'|'Spring'|'Summer1'|'Summer2'|'Summer10wk']. Required." },
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
        validateScheduleArgs(args);
        const query = scheduleArgsToQuery(args);
        const results: CourseOffering[] = await getCourseSchedules(query);
        return results;
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
        const requestedFields : string[] = Object.keys(parseResolveInfo(info).fieldsByTypeName.GradeDistributionCollection)
      
        // Construct a WHERE clause from the arguments
        const where : string = parseGradesParamsToSQL(args);
        
        // If requested, retrieve the grade distributions
        let grade_distributions;
        let gradeResults : GradeRawData;
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
              average_gpa: result.averageGPA ?? null,
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
        let aggregate : GradeDist;
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
        let instructors : string[];
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
  })
});


const schema = new GraphQLSchema({query: queryType});

export default schema;
