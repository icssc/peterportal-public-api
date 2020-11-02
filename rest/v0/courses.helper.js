const cache = require('../../cache/parsed_courses_cache.json')

function getAllCourses() {
   let result = [];
   for (course of Object.values(cache)) {
       result.push({department: course.department, number: course.number, title: course.title, description: course.description})
   }
   return result;
}

function getSpecificCourse(courseID) {
    return cache[courseID] ? cache[courseID] : null;
}


module.exports = {getAllCourses, getSpecificCourse}