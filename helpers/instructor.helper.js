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

function findInstructor(name, course) {
    // console.log(result);
    let ucinetids = getInstructorFromName(name);
    
    let ucinetid = "";
    
    if (!ucinetids){
        throw new Error(`Nothing was found for the instructor "${name}".`);
    }
    else if (ucinetids.length == 1) {
        return ucinetids[0]
    } 
    else { // multiple instructor objects need to check
        let instructors = ucinetids.map( id => getInstructor(id));
        // console.log(instructors);
        // instructors = instructors.filter( temp => temp.related_departments.includes(result.department));
        // if (instructors.length == 1) {
        //     //only one instructor was found 
        //     ucinetid = instructors[0].ucinetid
        // } else {
            //filter by course_history
            instructors = instructors.filter( inst => {
                const temp = inst.course_history.map((course) => getCourse(course.replace(/ /g, "")));
                return temp.includes(course);
            });
            if (instructors.length == 1) {
                return instructors[0].ucinetid;
            }
            throw new Error(`Nothing was found for the instructor "${name}".`);
        // }
    }
    return ucinetid;
}

module.exports = {getAllInstructors, getInstructor, findInstructor}