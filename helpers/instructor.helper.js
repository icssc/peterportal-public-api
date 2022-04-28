const cache = require('../cache/parsed_professor_cache.json');
const name_map = require('../cache/instructor_name_map.json');

function getAllInstructors() {
   return Object.values(cache);
}
function getBatchInstructors(instructorList) {
    let instructorInfo = {} 
    const instructors = instructorList.split(";")
    for (instructorID of instructors){
        instructorInfo[instructorID] = cache[instructorID] ? cache[instructorID] : null
    }
    return instructorInfo 
}
function getInstructor(ucinetid) {
    return cache[ucinetid] ? cache[ucinetid] : null;
}

function getUCINetIDFromName(name) {
    return name_map[name] ? name_map[name] : null;
}


module.exports = {getAllInstructors, getBatchInstructors, getInstructor, getUCINetIDFromName}