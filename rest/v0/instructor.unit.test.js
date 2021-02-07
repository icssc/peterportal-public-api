var {getAllInstructors, getSpecificInstructor} = require('../../helpers/instructor.helper')

describe('Get all Instructors', () => {
    describe('Fetching all instructors', () => {
        it ('getAllInstructors should return a json of all courses', () => {
            const allInstructors = getAllInstructors();
            expect(allInstructors).not.toBeNull() 
            expect(typeof allInstructors).toBe("object");
            expect(Array.isArray(allInstructors)).toBe(true);
            expect(allInstructors).toContainEqual(
                expect.objectContaining({"name": "Richard Eric Pattis", "ucinetid": "pattis"})
            );
            expect(allInstructors).toContainEqual(
                expect.objectContaining({"name": "Alexander W Thornton", "ucinetid": "thornton"})
            );
        });
    });
});

describe('Get specific instructors', () => {
    describe('Fetching specific instructors', () => {
        it ('getSpecificInstructor should return a json of the course requested', () => {
            const instructor = getSpecificInstructor("pattis");
            expect(instructor).not.toBeNull()
            expect(typeof instructor).toBe("object");
            expect(instructor).toMatchObject({
                "name":"Richard Eric Pattis",
                "ucinetid":"pattis",
                "phone":"(949) 824-2704",
                "title":"Professor of Teaching",
                "department":"Computer Science",
                "schools":["Donald Bren School of Information and Computer Sciences"],
                "related_departments":["COMPSCI","IN4MATX","I&C SCI","SWE","STATS"],
                "course_history":["I&C SCI 90","I&C SCI 193","I&C SCI 33","COMPSCI 199","I&C SCI 7","COMPSCI H198","I&C SCI 46"]
            });
        });
    });
});