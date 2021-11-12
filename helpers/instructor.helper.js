const cache = require('../cache/parsed_professor_cache.json');
const name_map = require('../cache/instructor_name_map.json');
var {Sentry} = require("../app.js");

function getAllInstructors() {
   return Object.values(cache);
}

function getInstructor(ucinetid) {
    let ret = cache[ucinetid] ? cache[ucinetid] : null;
    if(process.env.NODE_ENV == 'production' && ret == null){
        // If the following works, attempt use of 'const e = new Error()' and pass e to Sentry.captureException without try/catch
        try {
            throw new Error('instructor.helper.js: getInstructor could not find ucinetid: ' + ucinetid);
        } catch(e) {
            Sentry.captureException(e);
        }
    }
    return ret;
}

function getUCINetIDFromName(name) {
    let ret = name_map[name] ? name_map[name] : null;
    if(process.env.NODE_ENV == 'production' && ret == null){
        // If the following works, attempt use of 'const e = new Error()' and pass e to Sentry.captureException without try/catch
        try {
            throw new Error('instructor.helper.js: getUCINetIDFromName could not find name: ' + name);
        } catch(e) {
            Sentry.captureException(e);
        }
    }
    return ret;
}


module.exports = {getAllInstructors, getInstructor, getUCINetIDFromName}