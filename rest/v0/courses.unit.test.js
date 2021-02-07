var {getAllCourses, getSpecificCourse} = require('../../helpers/courses.helper')

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

describe('Get specific Courses', () => {
    describe('Fetching specific courses', () => {
        it ('getSpecificCourse should return a json of the course requested', () => {
            const course = getSpecificCourse("I&CSCI46");
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
                "prerequisite_text": "( CSE 45C OR I&C SCI 45C ) AND ( SCHOOL OF I&C SCI ONLY OR COMPUTER SCI & ENGR MAJORS ONLY )",
                "dependencies": ["COMPSCI 111", "COMPSCI 116", "COMPSCI 117", "COMPSCI 122D", "COMPSCI 141", "COMPSCI 143A", "COMPSCI 145", "COMPSCI 146", "COMPSCI 161", "COMPSCI 162", "COMPSCI 164", "COMPSCI 171", "COMPSCI 190", "COMPSCI 216", "COMPSCI 217", "COMPSCI 261", "EECS 111", "IN4MATX 101", "IN4MATX 115", "IN4MATX 122", "LSCI 102"],
                "terms": ["2020 Spring", "2021 Winter", "2019 Spring"]
            });
        });
    });
});