const cache = require('../cache/parsed_courses_cache.json')

function getAllCourses() {
   return Object.values(cache);
}
function getBatchCourses(coursesList) {
    let coursesInfo = {} 
    const courses = coursesList.split(";")
    for (courseID of courses){
        coursesInfo[courseID] = cache[courseID] ? cache[courseID] : null
    }
    return coursesInfo
}

function getCourse(courseID) {
    return cache[courseID] ? cache[courseID] : null;
}


module.exports = {getAllCourses, getBatchCourses, getCourse} 