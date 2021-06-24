const fetch = require('node-fetch');
var { callWebSocAPI } = require('websoc-api');
const fs = require('fs')

const getAllData = async () => {
    const years = ["2020"] //<-- to add more years
    const quarters = ["Fall", "Winter"/*, "Spring", "Summer1", "Summer2", "Summer10wk"*/]
    const codes = ["0-2400", "2401-4800" /*, "4801-7200", "7201-9600", "9601-12000", "12001-14400", "14401-16800",
        "16801-19200", "19201-21600", "21601-24000", "24001-26400", "26401-28800", "28801-31200",
        "31201-33600", "33601-36000", "36001-38400", "38401-40800", "40801-43200", "43201-45600",
        "45601-48000", "48001-50400", "50401-52800", "52801-55200", "55201-57600", "57601-60000",
        "60001-62400", "62401-64800", "64801-67200", "67201-69600", "69601-72000", "72001-74400",
        "74401-76800", "76801-79200", "79201-81600", "81601-84000", "84001-86400", "86401-88800",
"88801-91200", "91201-93600", "93601-96000", "96001-98400", "98401-99999"*/]

    //let allData = [] //final data for years, quarters and codes above ^
    for (const year of years) {
        for (const quarter of quarters) {
            for (const code of codes) {
                var result = []
                const opts = {
                    term: year+" "+quarter, //"2019 Fall"
                    sectionCodes: code //"12001-14400"
                }
                console.log(opts.term)
                console.log(opts.sectionCodes)
                try {
                    result = await callWebSocAPI(opts);
                } catch (error) {
                    console.log(error)
                }

                const data = [] //final data for specified term and courseCode
                result.schools.forEach(school => {
                    //adding schoolName to 'schoolObj' Object
                    const schoolObj = new Object();
                    schoolObj["schoolName"] = school.schoolName

                    //get array of departments
                    const departments = school.departments.map(department => {
                        return department
                    })

                    departments.forEach(department => {
                        //adding deptName, deptCode to 'dept' Object
                        const dept = new Object();
                        dept["deptName"] = department.deptName;
                        dept["deptCode"] = department.deptCode;

                        //get array of courses
                        const courses = department.courses.map(course => {
                            return course
                        })

                        courses.forEach(course => {
                            //adding courseNumber, courseTitle, prerequisiteLink to 'c' Object
                            const c = new Object();
                            c["courseNumber"] = course.courseNumber;
                            c["courseTitle"] = course.courseTitle;
                            c["prerequisiteLink"] = course.prerequisiteLink;

                            //getting array of sections
                            const sections = course.sections.map(section => {
                                return section
                            })

                            sections.forEach(section => {
                                //adding the respective fields to 'sects' Object
                                const sects = new Object();
                                sects["sectionCode"] = section.sectionCode;
                                sects["sectionType"] = section.sectionType;
                                sects["sectionNum"] = section.sectionNum;
                                sects["units"] = section.units;
                                sects["instructors"] = section.instructors.toString();

                                sects["finalExam"] = section.finalExam;
                                sects["maxCapacity"] = section.maxCapacity;
                                sects["numCurrentlyEnrolled_totalEnrolled"] = section.numCurrentlyEnrolled.totalEnrolled;
                                sects["numCurrentlyEnrolled_sectionEnrolled"] = section.numCurrentlyEnrolled.sectionEnrolled;
                                sects["numOnWaitlist"] = section.numOnWaitlist;
                                sects["numRequested"] = section.numRequested;
                                sects["numNewOnlyReserved"] = section.numNewOnlyReserved;
                                sects["restrictions"] = section.restrictions;
                                sects["status"] = section.status;

                                //meetings "days", "time", and "bldg" added 
                                const meetings = section.meetings.map(meeting => {
                                    return meeting
                                })
                                meetings.forEach(meeting => {
                                    //creating 'meet' Object
                                    const meet = new Object();
                                    meet["meeting_days"] = meeting.days;
                                    meet["meeting_time"] = meeting.time;
                                    meet["meeting_bldg"] = meeting.bldg;

                                    //merging all the objects created
                                    const new_course = {
                                        ...schoolObj,
                                        ...dept,
                                        ...c,
                                        ...sects,
                                        ...meet
                                    }
                                    //storing the objects into 'data'
                                    data.push(new_course)
                                })
                            })


                        })



                    })
                })
                //appends 'data' onto the JSON file for each iteration
                const stringdata = JSON.stringify(data)
                console.log(stringdata)
                fs.appendFile('webSOCdata.JSON', stringdata, function (err) {
                    if (err) throw err;
                    console.log('Updated!');
                  });
                console.log(data.length)
            }
        }
    }
}
getAllData();