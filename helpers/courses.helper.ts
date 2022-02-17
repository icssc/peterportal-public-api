import cache from '../cache/parsed_courses_cache.json';
import { Course } from '../types/types';


export function getAllCourses() : Course[] {
   return Object.values(cache);
}

export function getCourse(courseID: string) : Course {
    return cache[courseID] ? cache[courseID] : null;
}
