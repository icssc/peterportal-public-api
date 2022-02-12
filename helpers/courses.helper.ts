import cache from '../cache/parsed_courses_cache.json';


export function getAllCourses() {
   return Object.values(cache);
}

export function getCourse(courseID: string) {
    return cache[courseID] ? cache[courseID] : null;
}
