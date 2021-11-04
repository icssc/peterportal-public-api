const cache = require('../cache/parsed_courses_cache.json')
var {Sentry} = require("../app.js");

function getAllCourses() {
   return Object.values(cache);
}

function getCourse(courseID) {
    let ret = cache[courseID] ? cache[courseID] : null;
    if(process.env.NODE_ENV == 'production' && ret == null){
        Sentry.captureMessage('courses.helper.js: getCourse could not find: ' + courseID);
    }
    return ret;
}


module.exports = {getAllCourses, getCourse}