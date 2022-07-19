const cache = require("../cache/parsed_professor_cache.json");
const {storeData} = require("./fileStore.helper.js");
const path = require('path');

function mapInstructorName() {
    let instructors = Object.values(cache);
    let name_to_ucinetid = {};
    // create a mapping from instructor shortened name to ucinetid
    instructors.map((data) => {
        const shortened_name = data["shortened_name"];
        if (shortened_name in name_to_ucinetid) {
            console.log("KEY EXISTS: ", shortened_name , data["name"], data["ucinetid"]);
            console.log("DUPLICATE: ", name_to_ucinetid[shortened_name]);
            name_to_ucinetid[shortened_name] = name_to_ucinetid[shortened_name].concat([data["ucinetid"]]);
        } else {
            name_to_ucinetid[shortened_name] = [data["ucinetid"]];
        }
    });
    
    console.log("Storing data...");
    const file_path = path.resolve('cache', 'instructor_name_map.json');
    storeData(name_to_ucinetid, file_path);
    console.log("Finished writing to file");
}

mapInstructorName()
