import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { getCourse } from "../helpers/courses.helper";
import { getInstructor } from "../helpers/instructor.helper";
import {
  getCourseSchedules,
  scheduleArgsToQuery,
} from "../helpers/schedule.helper";
import { Course } from "../types/types";
import { instructorType } from "./instructor";
import { courseOfferingType } from "./schedule";

const courseType: GraphQLObjectType = new GraphQLObjectType({
  name: "Course",

  // fields must match schema from database
  // In this case, we're using a .json cache
  fields: () => ({
    id: { type: GraphQLString },
    department: { type: GraphQLString },
    number: { type: GraphQLString },
    school: { type: GraphQLString },
    title: { type: GraphQLString },
    course_level: { type: GraphQLString },
    department_alias: { type: new GraphQLList(GraphQLString) },
    units: { type: new GraphQLList(GraphQLFloat) },
    description: { type: GraphQLString },
    department_name: { type: GraphQLString },
    instructor_history: {
      type: new GraphQLList(instructorType),
      resolve: (course: Course) => {
        return course.professor_history.map((instructor_netid: string) =>
          getInstructor(instructor_netid)
        );
      },
    },
    prerequisite_tree: { type: GraphQLString },
    prerequisite_list: {
      type: new GraphQLList(courseType),
      resolve: (course) => {
        return course.prerequisite_list.map((prereq_id: string) =>
          getCourse(prereq_id.replace(/ /g, ""))
        );
      },
    },
    prerequisite_text: { type: GraphQLString },
    prerequisite_for: {
      type: new GraphQLList(courseType),
      resolve: (course) => {
        return course.prerequisite_for.map((prereq_id: string) =>
          getCourse(prereq_id.replace(/ /g, ""))
        );
      },
    },
    repeatability: { type: GraphQLString },
    concurrent: { type: GraphQLString },
    same_as: { type: GraphQLString },
    restriction: { type: GraphQLString },
    overlap: { type: GraphQLString },
    corequisite: { type: GraphQLString },
    ge_list: { type: new GraphQLList(GraphQLString) },
    ge_text: { type: GraphQLString },
    terms: { type: new GraphQLList(GraphQLString) },
    // can't add "same as" or "grading option" due to whitespace :((

    offerings: {
      type: new GraphQLList(courseOfferingType),
      args: {
        year: { type: GraphQLFloat },
        quarter: { type: GraphQLString },
        ge: { type: GraphQLString },
        division: { type: GraphQLString },
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
        room: { type: GraphQLString },
      },
      resolve: async (course, args, _, info) => {
        // Only fetch course schedule if it's a root course query.
        // This is because we don't want to spam webreg with successive calls from
        // queries like allCourses/allProfessors.
        const prev_path_type = info.path.prev.typename;

        if (prev_path_type == "Query") {
          const query = scheduleArgsToQuery({
            department: course.department,
            course_number: course.number,
            ...args,
          });
          return await getCourseSchedules(query);
        }

        // TODO: only return one error for a query, instead of one per item in the list
        throw new Error(
          `Accessing a course's offerings from a nested list is not allowed. Please use the schedules query`
        );
      },
    },
  }),
});
export { courseType };
