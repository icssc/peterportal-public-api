const cache = require('../cache/parsed_courses_cache.json')
var {Sentry} = require("../app.js");

function getAllCourses() {
   return Object.values(cache);
}

function getCourse(courseID) {
    let ret = cache[courseID] ? cache[courseID] : null;
    if(process.env.NODE_ENV == 'production' && ret == null){
        // If the following works, attempt use of 'const e = new Error()' and pass e to Sentry.captureException without try/catch
        try {
            throw new Error('courses.helper.js: getCourse could not find: ' + courseID);
        } catch(e) {
            Sentry.captureException(e);
        }
    }
    return ret;
}


module.exports = {getAllCourses, getCourse}