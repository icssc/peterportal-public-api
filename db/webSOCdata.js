const fetch = require('node-fetch');
var {callWebSocAPI} = require('websoc-api');

const getAllData = async () => {
    var result  = []
    const departments = []
    const opts = {
        term: '2019 Fall',
        sectionCodes: '10000-12400'
    }

    try {
        result = await callWebSocAPI(opts);
    } catch (error) {
        console.log(error)
    }
    schools = result.schools
    console.log(schools)
    
    // schools.forEach((school) => {departments.push(school.departments)})
    // //console.log(schools)
    // console.log(departments[0][0].courses)
    const courses = []
    const schoolNames = schools.forEach(school => {
        //adding schoolName to Object
        const course = new Object();
        course["schoolName"] = school.schoolName
        
        console.log("printing departments..")
        //get array of departments
        const departments = school.departments.map(department => {
            return department
        })
        console.log(departments)

        //adding deptName, deptCode
        departments.forEach(department => {
            course["deptName"] = department.deptName;
            course["deptCode"] = department.deptCode;
        })
        courses.push(course)

        console.log("printing courses...");
        
        console.log(courses)
    })
}
getAllData();