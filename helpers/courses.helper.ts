import cache from '../cache/parsed_courses_cache.json';
import { Course } from "../types/types";

//Return an array of all courses in our cache
export function getAllCourses() : Course[] {
   return Object.values(cache);
}

export function getCourses(coursesList) {
    let courses = []
    for (let courseID of coursesList){
        courses.push(cache[courseID] ? cache[courseID]: null)
    }
    return courses.length == 1 ? courses[0] : courses
}
//Return a course matching courseID "COMPSCI161"
export function getCourse(courseID: string) : Course {
    return cache[courseID] ?? null;
}
