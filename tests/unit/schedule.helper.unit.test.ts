import { getCourseSchedules } from "../../helpers/schedule.helper";
import { CourseOffering } from "../../types/websoc.types";

describe('Get Schedule of Classes', () => {
    it ('getCourseSchedules should return an array of results', async () => {
        const query = {
            term: "2019 Fall",
            department:"COMPSCI",
            courseNumber: "161"
        }
        const schedules : CourseOffering[] = await getCourseSchedules(query);
        expect(schedules).not.toBeNull() 
        expect(typeof schedules).toBe("object");
        expect(Array.isArray(schedules)).toBe(true);
        expect(schedules.length).toBeGreaterThan(0);
        const offering : CourseOffering = schedules[0];
        expect(schedules).toContainEqual(
            expect.objectContaining({
                "year": "2019", 
                "quarter": "Fall",
            })
        );
        expect(offering.course).toEqual(
            expect.objectContaining({
                "id": "COMPSCI161"
            })
        );
    });
});

describe('Get Schedule of Classes', () => {
    it ('getCourseSchedules throws error on bad parameter', async () => {
        
        const query = {
            year: "2019 Fall",
            department:"COMPSCI",
            courseNumber: "161"
        }
        getCourseSchedules(query).then(() => {
            fail("error not thrown on bad parameter")
        }).catch((err) => {
            console.log(err.message);
        });
    });
    
});