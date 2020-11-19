const sqlite3 = require('sqlite3').verbose();
var path = require('path');

function queryData(sql, res) {
    const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));
    var result = [];

    db.all(sql, (err, rows) => {
        console.log(sql);
        if (err) {
            throw err;
        } 
        rows.forEach((row) => {
            result.push(row);
        });

        res.send(result);
    })
}

module.exports = {queryData};