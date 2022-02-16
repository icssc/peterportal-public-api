import {getAllCourses, getCourse} from '../../helpers/courses.helper';


describe('Get all Courses', () => {
    describe('Fetching all courses', () => {
        it ('getAllCourses should return a json of all courses', () => {
            const allCourses = getAllCourses();
            expect(allCourses).not.toBeNull() 
            expect(typeof allCourses).toBe("object");
            expect(Array.isArray(allCourses)).toBe(true);
            expect(allCourses).toContainEqual(
                expect.objectContaining({"number": "46", "department": "I&C SCI"})
            );
            expect(allCourses).toContainEqual(
                expect.objectContaining({"number": "134E", "department": "ART HIS"})
            );
        });
    });
});

describe('Get Courses', () => {
    describe('Fetching course', () => {
        it ('getCourse should return a json of the course requested', () => {
            const course = getCourse("I&CSCI46");
            expect(course).not.toBeNull()
            expect(typeof course).toBe("object");
            expect(course).toMatchObject({
                "id": "I&CSCI46",
                "department": "I&C SCI",
                "school": "Donald Bren School of Information and Computer Sciences",
                "title": "Data Structure Implementation and Analysis",
                "course_level": "Lower Division (1-99)",
                "department_alias": ["ICS"],
                "units": [4, 4],
                "description": "Focuses on implementation and mathematical analysis of fundamental data structures and algorithms. Covers storage allocation and memory management techniques.",
                "professor_history": expect.arrayContaining(["sgagomas", "klefstad", "pattis", "thornton", "mikes"]),
                "prerequisite_tree": "{\"OR\":[\"CSE 45C\",\"I&C SCI 45C\"]}",
                "prerequisite_list": expect.arrayContaining(["I&C SCI 45C", "CSE 45C"]),
                "prerequisite_text": expect.any(String),
                "prerequisite_for": expect.any(Array)
            });
            expect(course["prerequisite_for"]).toEqual(expect.arrayContaining(["COMPSCI 116", "COMPSCI 117", "COMPSCI 122D", "COMPSCI 141", "COMPSCI 143A",
             "COMPSCI 145", "COMPSCI 146", "COMPSCI 161", "COMPSCI 162", "COMPSCI 164", "COMPSCI 171"]))
        });
    });
});