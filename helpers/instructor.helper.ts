import cache from '../cache/parsed_professor_cache.json';
import name_map from '../cache/instructor_name_map.json';
import { Instructor } from "../types/types"

//Return an array of all instructors in our cache
export function getAllInstructors() : Instructor[] {
   return Object.values(cache);
}

export function getInstructors(instructorList: string[]) : Instructor | Instructor[] {
    let instructors: Instructor[] = []
    for (let instructorID of instructorList){
        instructors.push(cache[instructorID] ? cache[instructorID] : null)
    }
    return instructors.length == 1 ? instructors[0] : instructors
}
//Return an array of all courses in our cache
export function getInstructor(ucinetid: string) : Instructor {
    return cache[ucinetid] ?? null;
}

//Returns an array of possible UCINetIDs matching a name like "PATTIS, R."
export function getUCINetIDFromName(name: string) : string[] {
    return name_map[name] ?? null;
}

