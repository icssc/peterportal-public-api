const db = require('better-sqlite3'); 
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
`;

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
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );
`;

var connection; 

async function initSQLite() {
    console.log("🧠 Creating in-memory SQLite instance...")

    await fs.open(path.join(__dirname, 'db.sqlite'), 'w', function (err, file) {
        if (err) throw err;
        console.log("✅ SQLite file created!");
      });

    console.log("🗄️ Creating gradeDistribution table...");

    connection = new db(path.join(__dirname, 'db.sqlite'));

    console.log("✅ gradeDistribution table created!");

    connection.prepare(gradeDistributionTableSchema).run();
    
    insertData();
    
}

function insertData() {
    console.log("🗄️ Inserting gradeDistribution data from CSV...")
    let stream = fs.createReadStream(path.join(__dirname, 'complete.csv')).pipe(csv());

    stream.on('data', (row) => {
            connection.prepare(gradeDistributionInsertQuery).run(
                row.year, 
                row.quarter.toUpperCase(), 
                row.deptCode, 
                row.number, 
                row.code, 
                row.section, 
                row.professor, 
                row.type, 
                row.A, 
                row.B, 
                row.C, 
                row.D, 
                row.F, 
                row.P, 
                row.NP, 
                row.W, 
                row.avg);
    });

    stream.on('error', (err) => console.log(err));

    stream.on('close', () => console.log("✅ All gradeDistribution data inserted!"));
}

initSQLite();