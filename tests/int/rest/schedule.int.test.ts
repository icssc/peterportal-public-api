import request from '../api.int.helper';
import {Error} from "../../../types/types";
import {WebsocResponse} from "../../../types/websoc.types"

jest.setTimeout(30000);

describe('GET /schedule/soc', () => {
    it('sends valid query string to /schedule/soc', () => request
    .get('/rest/v0/schedule/soc?instructorName=Carvalho&term=2021+Winter&ge=ANY&department=ECON&courseNumber=100B&division=ALL&sectionCodes=62120&courseTitle=INTER+ECONOMICS+II&sectionType=ALL&units=4&days=TuTh&startTime=11:00AM&endTime=12:20PM&maxCapacity=344&fullCourses=ANY&cancelledCourses=EXCLUDE')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        const result : WebsocResponse = response.body;
        expect(result).not.toBeNull();
        expect(result).toHaveProperty('schools');
        expect(Array.isArray(result['schools'])).toBeTruthy();
        expect(result['schools'].length).toBeGreaterThan(0);
    }));
});

describe('GET /schedule/soc', () => {
    it('sends invalid query string to /schedule/soc', () => request
    .get('/rest/v0/schedule/soc?instructor=Carvalho&term=2021+Winter')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
        const result : Error = response.body;
        expect(result).toHaveProperty('timestamp');
        expect(result['status']).toEqual(400);
        expect(result['error']).toEqual("Bad Request: Invalid parameter");
        expect(result['message']).toEqual("Unable to complete websoc-api query");
    }));
});