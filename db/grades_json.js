const fs = require('fs');
const csv = require('csv-parser');
var path = require('path');
const {storeData} = require("../utils/fileStore.helper");

` year: '2014-15',
quarter: 'Fall',
department: 'Mathematics',
number: '1',
code: '44030',
section: 'B',
title: 'PRE-CALCULUS',
type: 'LEC',
instructor: 'PHAM, K.',
A: '14',
B: '56',
C: '45',
D: '21',
F: '26',
P: '1',
NP: '8',
W: '1',
avg: '2.06',
realNum: '1B',
dept: 'Mathematics',
deptCode: 'MATH',
actualYear: '2014'`

grades_by_instructor = {}
grades_by_course = {}

fs.createReadStream(path.join(__dirname, 'grades.csv'))
    .pipe(csv())
    .on('data', row => {
        grades_by_instructor[instructor] = row
    })
    .on('end', () => {
        console.log("Finished parsing grades.");
    });

let file_path = path.resolve('cache', 'grades_instructor_cache.json');
storeData(grades_by_instructor, file_path);