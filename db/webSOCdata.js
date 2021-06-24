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
    //console.log(schools)
    
    const data = []
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
            const dept = new Object();
            dept["deptName"] = department.deptName;
            dept["deptCode"] = department.deptCode;
            
            const new_course = {
                ...course,
                ...dept
            }
            
            data.push(new_course)

            //console.log(department)
            const courses = department.courses.map(course => {
                return course
            })
            
            console.log("courses here!!")
            console.log(courses)
           
            // courses.forEach(course => {
            //     const c = new Object();
            //     c["courseNumber"]=course.courseNumber;

            //     const new_course = {
            //         ...data,
            //         ...dept,
            //         ...c
            //     }
            //     data.push(new_course)
            // })



        })

        // console.log("printing courses...");
        // console.log(courses)
    })
    console.log("print final courses")
    console.log(data)
}
getAllData();