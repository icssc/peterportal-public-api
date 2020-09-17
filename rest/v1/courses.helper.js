const cache = require('../../cache/parsed_courses_cache.json')

function getAllCourses() {
    return cache;
}

function getSpecificCourse(courseID) {
    return cache[courseID] ? cache[courseID] : null;
}


module.exports = {getAllCourses, getSpecificCourse}