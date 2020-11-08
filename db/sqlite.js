const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');
var path = require('path');

const gradeDistributionTableSchema = `
    CREATE TABLE gradeDistribution (
        year char(12) NOT NULL,
        quarter char(12) NOT NULL,
        department char(12) NOT NULL,
        number char(6) NOT NULL,
        code int NOT NULL,
        section char(6) NOT NULL,
        instructor char(64) NOT NULL,
        type char(6) NOT NULL,
        gradeACount int NOT NULL,
        gradeBCount int NOT NULL,
        gradeCCount int NOT NULL,
        gradeDCount int NOT NULL,
        gradeFCount int NOT NULL,
        gradePCount int NOT NULL,
        gradeNPCount int NOT NULL,
        gradeWCount int NOT NULL,
        averageGPA decimal
    );
`

const gradeDistributionInsertQuery = `
    INSERT INTO gradeDistribution (
        year, 
        quarter, 
        department, 
        number, 
        code, 
        section, 
        instructor, 
        type, 
        gradeACount, 
        gradeBCount,
        gradeCCount,
        gradeDCount,
        gradeFCount,
        gradePCount,
        gradeNPCount,
        gradeWCount,
        averageGPA) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`

var db; 

async function initSQLite() {
    console.log("Creating in-memory SQLite instance...")

    fs.open(path.join(__dirname, 'db.sqlite'), 'w', function (err, file) {
        if (err) throw err;
        console.log('SQLite File Created!');
      });

    db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));
    await db.run(gradeDistributionTableSchema, insertData);
    
}

async function insertData() {
    await fs.createReadStream(path.join(__dirname, 'complete.csv'))
        .pipe(csv())
        .on('data', (row) => {
            db.run(gradeDistributionInsertQuery, [row.year, row.quarter.toUpperCase(), row.deptCode, row.number, row.code, row.section, row.prof, row.type, row.A, row.B, row.C, row.D, row.F, row.P, row.NP, row.W, row.avg], function(err) {
                if (err) {
                return console.log(err.message);
                }
            });
        });
}

initSQLite();