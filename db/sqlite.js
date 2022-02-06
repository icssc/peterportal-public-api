const db = require('better-sqlite3'); 
const fs = require('fs');
const csv = require('csv-parser');
var path = require('path');

const gradeDistributionTableSchema = `
    CREATE TABLE gradeDistribution (
        year char(12) NOT NULL,
        quarter char(12) NOT NULL,
        department char(12) NOT NULL,
        department_name varchar(64) NOT NULL,
        number char(6) NOT NULL,
        number_int int NOT NULL,
        code int NOT NULL,
        section char(6) NOT NULL,
        title varchar(64) NOT NULL,
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

const gradeDistributionIndexes = [
    `CREATE INDEX idx_department ON gradeDistribution(department);`,
    `CREATE INDEX idx_instructor ON gradeDistribution(instructor);`
]

const gradeDistributionInsertQuery = `
    INSERT INTO gradeDistribution (
        year, 
        quarter, 
        department, 
        department_name,
        number, 
        number_int,
        code, 
        section, 
        title, 
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
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
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
    for (const index of gradeDistributionIndexes) {
        connection.prepare(index).run();
    }

    
    insertData();
    
}

function insertData() {
    console.log("🗄️ Inserting gradeDistribution data from CSV...")
    let stream = fs.createReadStream(path.join(__dirname, 'grades.csv')).pipe(csv());

    stream.on('data', (row) => {
            connection.prepare(gradeDistributionInsertQuery).run(
                row.year, 
                row.quarter.toUpperCase(), 
                row.dept_code, 
                row.dept,
                row.number,
                row.base_number,
                row.code, 
                row.section, 
                row.title, 
                row.instructor, 
                row.type, 
                row.A, 
                row.B, 
                row.C, 
                row.D, 
                row.F, 
                row.P, 
                row.NP, 
                row.W, 
                row.avg_gpa);
    });

    stream.on('error', (err) => console.log(err));

    stream.on('close', () => console.log("✅ All gradeDistribution data inserted!"));
}

initSQLite();