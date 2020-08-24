const dotenv = require('dotenv');
const path = require('path')
var mysql = require('mysql');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

//create global connection to database
var pool = mysql.createPool({
    host     : process.env.REVIEWS_DB_ENDPOINT,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    multipleStatements: true,
    connectionLimit: 20,
    database : 'peterportal'
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

var executeQuery = function(sql, callback) {
    getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(sql, function (error, results, fields) {
          if(error) throw error;
          callback(results);
          connection.release();
        });
      });
}

module.exports = {executeQuery: executeQuery, pool: pool, escape: mysql.escape};