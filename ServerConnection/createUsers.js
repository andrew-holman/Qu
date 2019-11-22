var mysql = require('mysql');

var con = mysql.createConnection({
  host: "coms-319-060.cs.iastate.edu",
  user: "team12",
  password: "team12comsVM@319",
  database: "QuDatabase"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to server!");
  var sqlCreate = "CREATE TABLE if not exists Users(username VARCHAR(255), password VARCHAR(255), PRIMARY KEY (username))";  
  con.query(sqlCreate, function (err, result) {
    if (err) {
      console.log(err);
      throw err;
    } else{
        console.log("Prepare to insert to table Users: ");
		var userValues = [["sampleUser1", "samplePassword1"],
						["sampleUser2", "samplePassword2"]];
		var sqlInsert = "INSERT INTO Users (username, password) VALUES ?";
        con.query(sqlInsert, [userValues], function (err, result) {
          if (err) {
            console.log("Creation Error!: " + err);
          } else{
              console.log("Users table created");
          }

        });

        con.end(function(err) {
         if (err) {
           return console.log(err.message);
         } else{
           console.log("Close connection!");
         }
       });
    }

  });



});
