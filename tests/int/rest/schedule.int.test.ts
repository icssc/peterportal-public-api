import request from '../api.int.helper';

jest.setTimeout(30000);

describe('GET /schedule/soc', () => {
    it('sends valid query string to /schedule/soc', () => request
    .get('/rest/v0/schedule/soc?instructorName=Carvalho&term=2021+Winter&ge=ANY&department=ECON&courseNumber=100B&division=ALL&sectionCodes=62120&courseTitle=INTER+ECONOMICS+II&sectionType=ALL&units=4&days=TuTh&startTime=11:00AM&endTime=12:20PM&maxCapacity=344&fullCourses=ANY&cancelledCourses=EXCLUDE')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).not.toBeNull();
        expect(response.body).toHaveProperty('schools');
        expect(Array.isArray(response.body['schools'])).toBeTruthy();
        expect(response.body['schools'].length).toBeGreaterThan(0);
    }));
});

describe('GET /schedule/soc', () => {
    it('sends invalid query string to /schedule/soc', () => request
    .get('/rest/v0/schedule/soc?instructor=Carvalho&term=2021+Winter')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body['status']).toEqual(400);
        expect(response.body['error']).toEqual("Bad Request: Invalid parameter");
        expect(response.body['message']).toEqual("Unable to complete websoc-api query");
    }));
});