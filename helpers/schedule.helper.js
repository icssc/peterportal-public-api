var {callWebSocAPI} = require('websoc-api');

var {getCourse} = require('../helpers/courses.helper')


// Format Course Offering
// Given a course from the websoc api, we need to format it for graphql
// and inject some addtional information such as the course id, year, and quarter
function _formatCourseOffering(course, additionalArgs) {
    return {
        ...additionalArgs,
        final_exam: course.finalExam,
        instructors: course.instructors,
        max_capacity: course.maxCapacity,
        meetings: course.meetings,
        num_section_enrolled: course.numCurrentlyEnrolled.sectionEnrolled === '' ? 0: course.numCurrentlyEnrolled.sectionEnrolled,
        num_total_enrolled: course.numCurrentlyEnrolled.totalEnrolled === '' ? 0: course.numCurrentlyEnrolled.totalEnrolled,
        num_new_only_reserved: course.numNewOnlyReserved === '' ? 0: course.numNewOnlyReserved,
        num_on_waitlist: course.numOnWaitlist === '' ? 0: course.numOnWaitlist,
        num_requested: course.numRequested === '' ? 0: course.numRequested,
        restrictions: course.restrictions,
        section: {
            code: course.sectionCode, comment: course.sectionComment, number: course.sectionNum, type: course.sectionType
        },
        status: course.status,
        units: course.units
    }
}

async function getCourseSchedules(query) {
    const results = await callWebSocAPI(query);
    const year = query.term.split(" ")[0]
    const quarter = query.term.split(" ")[1]
    var courses = [];
    for (const school of results["schools"]) {
        for (const dept of school["departments"]) {
            for (const course of dept["courses"]) {
                const courseID = (course["deptCode"] + course["courseNumber"]).replace(/ /g, "", "");
                courses.push({
                    offerings: course["sections"].map(section => _formatCourseOffering(section, {course: courseID, year, quarter})),
                    ...getCourse(courseID),
                })
            }
        }
    }
    return courses
    /*
    TODO: Handle potential errors

    }).catch((err) => {
        throw err
        //res.status(400).json(createErrorJSON(400, "Bad Request: Invalid parameter", "Unable to complete websoc-api query"));
    })
    */
}
  
module.exports = {getCourseSchedules}