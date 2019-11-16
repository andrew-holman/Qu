var mysql = require('mysql');

var con = mysql.createConnection({
  host: "coms-319-060.cs.iastate.edu",
  user: "team12",
  password: "team12comsVM@319",
  database: "QuDatabase"
});//10.24.226.194
con.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connected to server!");
    var sqlQuery = "SELECT * FROM Users";
    con.query(sqlQuery, function (err, result, fields) {
        if (err) {
            throw err;
        }
        //console.log(result[0].username);
        console.log(result);
        con.end(function (err) {
            if (err) {
                return console.log(err.message);
            } else {
                console.log("Close connection!");
            }
        });
    });

});
