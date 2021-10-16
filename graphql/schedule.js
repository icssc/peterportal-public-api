const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
  } = require('graphql');

const {instructorType} = require('./instructor.js')

const {getInstructor, getUCINetIDFromName} = require('../helpers/instructor.helper');
const {getCourse} = require('../helpers/courses.helper');

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
            else if (ucinetids && ucinetids.length > 1 && (course = getCourse(offering.course))) {
  
                //Filter our instructors by those with related departments.
                let course_dept = course.department;
                let instructors = ucinetids.map(id => getInstructor(id)).filter( temp => temp.related_departments.includes(course_dept));
                
                //If only one is left and it's in the instructor cache, we can return it.
                if (instructors.length == 1) {
                  const instructor = getInstructor(ucinetids[0]);
                  if (instructor) { return instructor; }  
                } else {
                  //Filter instructors by those that taught the course before.
                  instructors = instructors.filter( inst => {
                    return inst.course_history.map((course) => getCourse(course.replace(/ /g, ""))).includes(offering.course);
                  });
                
                  //If only one is left and it's in the instructor cache, we can return it.
                  if (instructors.length == 1) { 
                    const instructor = getInstructor(ucinetids[0]);
                    if (instructor) { return instructor; }  
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

module.exports = {meetingType, sectionInfoType, courseOfferingType, scheduleArgsToQuery, validateScheduleArgs} 