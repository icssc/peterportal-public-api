const cache = require('../cache/parsed_professor_cache.json');
const name_map = require('../cache/instructor_name_map.json');

function getAllInstructors() {
   return Object.values(cache);
}

function getInstructor(ucinetid) {
    return cache[ucinetid] ? cache[ucinetid] : null;
}

function getInstructorFromName(name) {
    return name_map[name] ? name_map[name] : null;
}


module.exports = {getAllInstructors, getInstructor, getInstructorFromName}