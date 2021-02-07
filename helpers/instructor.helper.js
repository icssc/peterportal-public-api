const cache = require('../cache/parsed_professor_cache.json')

function getAllInstructors() {
   let result = [];
   for (prof of Object.values(cache)) {
       result.push({name: prof.name, ucinetid: prof.ucinetid, title: prof.title, department: prof.department})
   }
   return result;
}

function getSpecificInstructor(ucinetid) {
    return cache[ucinetid] ? cache[ucinetid] : null;
}


module.exports = {getAllInstructors, getSpecificInstructor}