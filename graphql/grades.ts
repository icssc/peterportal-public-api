import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql'

import { courseOfferingType } from './schedule';

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
    grade_distributions: {type: new GraphQLList(gradeDistributionType)},
    instructors: { 
      type: new GraphQLList(GraphQLString),
      description: "List of instructors present in the Grade Distribution Collection" 
    }
  })
});

  export {gradeDistributionType, gradeDistributionCollectionAggregateType, gradeDistributionCollectionType};