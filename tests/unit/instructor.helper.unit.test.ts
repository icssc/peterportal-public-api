import {getAllInstructors, getInstructor, getInstructors} from '../../helpers/instructor.helper';
import {Instructor} from "../../types/types";

describe('Fetching all instructors', () => {
    it ('getAllInstructors should return a json of all courses', () => {
        const allInstructors : Instructor[] = getAllInstructors();
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

describe('Fetching some instructors', () => {
    it ('getInstructors should return a json of few courses requested', () => {
        const instructors : {[key: string]: Instructor} = getInstructors(["pattis", "thornton"]);
        expect(instructors).not.toBeNull() 
        expect(typeof instructors).toBe("object");
        expect(instructors["pattis"]).toMatchObject({"name": "Richard Eric Pattis", "ucinetid": "pattis"});
        expect(instructors["thornton"]).toMatchObject({"name": "Alexander W Thornton", "ucinetid": "thornton"});
    });
});

describe('Fetching instructor', () => {
    it ('getInstructor should return a json of the course requested', () => {
        const instructor : Instructor = getInstructor("pattis");
        expect(instructor).not.toBeNull()
        expect(typeof instructor).toBe("object");
        expect(instructor).toMatchObject({
            "name":"Richard Eric Pattis",
            "ucinetid":"pattis",
            "email": "pattis@uci.edu",
            "title":"Professor of Teaching",
            "department":"Computer Science",
            "schools":["Donald Bren School of Information and Computer Sciences"],
            "related_departments":["COMPSCI","IN4MATX","I&C SCI","SWE","STATS"],
            "course_history": expect.arrayContaining(["I&C SCI 90", "I&C SCI 193", "I&C SCI 33", "I&C SCI 46"])
        });
    });
});