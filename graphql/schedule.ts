import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql'
import { instructorType } from './instructor';
import { courseType } from './course';

import { getInstructor, getUCINetIDFromName } from '../helpers/instructor.helper';
import { getCourse } from '../helpers/courses.helper';
import { ValidationError } from '../helpers/errors.helper';

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
});
  
const sectionInfoType = new GraphQLObjectType({
  name: "SectionInfo",
  
  fields: () => ({
    code: { type: GraphQLString },
    comment: { type: GraphQLString },
    number: { type: GraphQLString },
    type: { type: GraphQLString }
  })
});

const courseOfferingType = new GraphQLObjectType({
  name: "CourseOffering",

  fields: () => ({
    year: { type: GraphQLString },
    quarter: { type: GraphQLString },
    instructors: { 
      type: new GraphQLList(instructorType),
      resolve: (offering) => {
        return offering.instructors.map((name: string) => {
          
          //Fetch all possible ucinetids from the instructor.
          let ucinetids : string[] = getUCINetIDFromName(name);
          
          //If only one ucinetid exists and it's in the instructor cache, 
          //then we can return the instructor for it.
          if (ucinetids && ucinetids.length == 1) { 
            const instructor = getInstructor(ucinetids[0]);
            if (instructor) { return instructor; }
          }
          //If there is more than one and the course exists, 
          //use the course to figure it out.
          else if (ucinetids && ucinetids.length > 1 && offering.course) {

              //Filter our instructors by those with related departments.
              let course_dept = offering.course.department;
              let instructors = ucinetids.map(id => getInstructor(id)).filter( temp => temp.related_departments.includes(course_dept));
              
              //If only one is left and it's in the instructor cache, we can return it.
              if (instructors.length == 1) {
                return instructors[0];
              } else {
                //Filter instructors by those that taught the course before.
                instructors = instructors.filter( inst => {
                  return inst.course_history.map((course) => course.replace(/ /g, "")).includes(offering.course.id);
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
    meetings: { type: new GraphQLList(meetingType) },
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
});

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

export {meetingType, sectionInfoType, courseOfferingType, validateScheduleArgs};