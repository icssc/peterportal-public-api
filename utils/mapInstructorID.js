const {getAllInstructors} = require("../helpers/instructor.helper");
const {storeData} = require("./fileStore.helper.js");
var path = require('path');

function mapInstructorName() {
    let instructors = getAllInstructors()
    var name_to_ucinetid = {};
    instructors.map((data) => {
        let names = data["name"].split(" ");
        var firstName = names[0];
        var lastName = names[names.length-1];
        var key = (lastName + ", " + firstName[0] + ".").toUpperCase();
        if (key in name_to_ucinetid) {
            console.log("KEY EXISTS: ", key, data["name"], data["ucinetid"])
            console.log("DUPLICATE: ", name_to_ucinetid[key]);
            name_to_ucinetid[key] = name_to_ucinetid[key].concat([data["ucinetid"]]);
        } else {
            name_to_ucinetid[key] = [data["ucinetid"]];
        }
    });
    
    console.log("Result for Kei Akagi(AKAGI, K.): ", name_to_ucinetid["AKAGI, K."]);
    console.log("Storing data...")
    file_path = path.resolve('cache', 'instructor_name_map.json');
    storeData(name_to_ucinetid, file_path);
    console.log("Finished writing to file");
}

module.exports = {mapInstructorName};
