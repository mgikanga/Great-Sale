//require mysql and install their npms
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    //name of the database
    database: "bamazon_db"
  });

  //make connection with the database
connection.connect(function (err){
    if(err) throw err;
    console.log("connected");
})



  