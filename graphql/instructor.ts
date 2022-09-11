import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { getCourse } from "../helpers/courses.helper";
import { getInstructor } from "../helpers/instructor.helper";
import { Instructor } from "../types/types";
import { courseType } from "./course";

const instructorType: GraphQLObjectType = new GraphQLObjectType({
  name: "Instructor",

  fields: () => ({
    name: { type: GraphQLString },
    shortened_name: {
      type: GraphQLString,
      description:
        "Name as it appears on webreg. Follows the format: `DOE, J.`",
      resolve: (instructor: Instructor) => {
        if (instructor.shortened_name) {
          return instructor.shortened_name;
        } else {
          // If the shortened_name wasn't provided,
          // we can construct it from the name.
          const name_parts = instructor.name.split(" ");
          return `${name_parts[name_parts.length - 1]}, ${
            name_parts[0][0]
          }.`.toUpperCase();
        }
      },
    },
    ucinetid: { type: GraphQLString },
    email: { type: GraphQLString },
    title: { type: GraphQLString },
    department: { type: GraphQLString },
    schools: { type: new GraphQLList(GraphQLString) },
    related_departments: { type: new GraphQLList(GraphQLString) },
    course_history: {
      type: new GraphQLList(courseType),
      resolve: (instructor) => {
        return getInstructor(instructor.ucinetid)["course_history"].map(
          (course_id) => getCourse(course_id.replace(/ /g, ""))
        );
      },
    },
  }),
});
export { instructorType };
