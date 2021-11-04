const cache = require('../cache/parsed_professor_cache.json');
const name_map = require('../cache/instructor_name_map.json');
var {Sentry} = require("../app.js");

function getAllInstructors() {
   return Object.values(cache);
}

function getInstructor(ucinetid) {
    let ret = cache[ucinetid] ? cache[ucinetid] : null;
    if(process.env.NODE_ENV == 'production' && ret == null){
        Sentry.captureMessage('instructor.helper.js: getInstructor could not find ucinetid: ' + ucinetid);
    }
    return ret;
}

function getUCINetIDFromName(name) {
    let ret = name_map[name] ? name_map[name] : null;
    if(process.env.NODE_ENV == 'production' && ret == null){
        Sentry.captureMessage('instructor.helper.js: getUCINetIDFromName could not find name: ' + name);
    }
    return ret;
}


module.exports = {getAllInstructors, getInstructor, getUCINetIDFromName}