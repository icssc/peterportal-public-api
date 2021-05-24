const cache = require('../cache/parsed_courses_cache.json')

function getAllCourses() {
   return Object.values(cache);
}

function getCourse(courseID) {
    return cache[courseID] ? cache[courseID] : null;
}


module.exports = {getAllCourses, getCourse}