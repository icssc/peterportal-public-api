import cache from '../cache/parsed_professor_cache.json';
import name_map from '../cache/instructor_name_map.json';
import { Instructor } from "../types/types"

//Return an array of all instructors in our cache
export function getAllInstructors() : Instructor[] {
   return Object.values(cache);
}

//Return an array of all courses in our cache
export function getInstructor(ucinetid: string) : Instructor {
    return cache[ucinetid] ? cache[ucinetid] : null;
}

//Returns an array of possible UCINetIDs matching a name like "PATTIS, R."
export function getUCINetIDFromName(name: string) : string[] {
    return name_map[name] ? name_map[name] : null;
}

