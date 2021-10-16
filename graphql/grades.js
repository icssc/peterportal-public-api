const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
  } = require ('graphql');

const {courseOfferingType} = require ('./schedule.js')

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
      grade_distributions: {type: GraphQLList(gradeDistributionType)},
      instructors: { 
        type: GraphQLList(GraphQLString),
        description: "List of instructors present in the Grade Distribution Collection" 
      }
    })
  });

  module.exports = {gradeDistributionType, gradeDistributionCollectionAggregateType, gradeDistributionCollectionType}