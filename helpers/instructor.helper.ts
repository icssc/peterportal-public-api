import name_map from "../cache/instructor_name_map.json";
import cache from "../cache/parsed_professor_cache.json";
import { Instructor } from "../types/types";

//Return an array of all instructors in our cache
export function getAllInstructors(): Instructor[] {
  return Object.values(cache);
}

export function getInstructors(instructorList: string[]): {
  [key: string]: Instructor;
} {
  const instructors: Record<string, Instructor> = {};
  for (const instructorID of instructorList) {
    instructors[instructorID] = cache[instructorID]
      ? <Instructor>cache[instructorID]
      : null;
  }
  return instructors;
}
//Return an array of all courses in our cache
export function getInstructor(ucinetid: string): Instructor {
  return <Instructor>cache[ucinetid] ?? null;
}

//Returns an array of possible UCINetIDs matching a name like "PATTIS, R."
export function getUCINetIDFromName(name: string): string[] {
  return <string[]>name_map[name] ?? null;
}
