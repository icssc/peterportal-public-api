var {getAllCourses, getSpecificCourse} = require('./courses.helper')

describe('Get all Courses', () => {
    describe('Fetching all courses', () => {
        it ('getAllCourses should return a json of all courses', () => {
            const allCourses = getAllCourses();
            expect(allCourses).not.toBeNull() 
            expect(typeof allCourses).toBe("object");
            expect(allCourses).toMatchObject({
                "I&CSCI46": expect.anything(),
                "I&CSCI33": expect.anything()
            });
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
                "id": "I&C SCI 46",
                "id_department": "I&C SCI",
                "id_number": "46",
                "id_school": "Donald Bren School of Information and Computer Sciences",
                "name": "Data Structure Implementation and Analysis",
                "course_level": "Lower Division (1-99)",
                "dept_alias": ["ICS"],
                "units": [4, 4],
                "description": "Focuses on implementation and mathematical analysis of fundamental data structures and algorithms. Covers storage allocation and memory management techniques.",
                "department": "Information and Computer Science",
                "professorHistory": ["sgagomas", "klefstad", "pattis", "thornton"],
                "prerequisiteJSON": "{\"OR\":[\"CSE 45C\",\"I&C SCI 45C\"]}",
                "prerequisiteList": ["I&C SCI 45C", "CSE 45C"],
                "prerequisite": "( CSE 45C OR I&C SCI 45C ) AND ( NO REPEATS ALLOWED IF GRADE = C OR BETTER ) AND ( SCHOOL OF I&C SCI ONLY OR COMPUTER SCI & ENGR MAJORS ONLY )",
                "dependencies": ["COMPSCI 111", "COMPSCI 116", "COMPSCI 117", "COMPSCI 141", "COMPSCI 143A", "COMPSCI 145", "COMPSCI 146", "COMPSCI 161", "COMPSCI 162", "COMPSCI 164", "COMPSCI 171", "COMPSCI 190", "COMPSCI 216", "COMPSCI 217", "COMPSCI 261", "EECS 111", "IN4MATX 101", "IN4MATX 115", "IN4MATX 122", "LSCI 102"],
                "repeatability": "",
                "grading option": "",
                "concurrent": "",
                "same as": "",
                "restriction": "",
                "overlaps": "",
                "corequisite": "",
                "ge_types": ["GE Vb: Formal Reasoning"],
                "ge_string": "(Vb)",
                "terms": ["2020 Fall", "2019 Spring"]
            });
        });
    });
});