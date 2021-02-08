const cache = require('../cache/parsed_professor_cache.json')

function getAllInstructors() {
   return Object.values(cache);
}

function getInstructor(ucinetid) {
    return cache[ucinetid] ? cache[ucinetid] : null;
}


module.exports = {getAllInstructors, getInstructor}