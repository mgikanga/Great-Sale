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
/*

function allProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        var results = (res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quatity);
      
          
     
    }
    return results;
    console.log("Item_id","|","product_name","|","Department_name","|","price","|","stock")
    console.log(results)
      console.log("-----------------------------------");
    });
}
allProducts()

*/
// the start function to display all the item in stock
function start() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // once you have the items, prompt the user for which item they would like to purchase
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
                // output all the items from the database and display to the choices as a list
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                  choiceArray.push(res[i].product_name);
                }
                return choiceArray;
              },
            message: "Input the ID of the product you would like to purchase."
          },
          {
            name: "bid",
            type: "input",
            message: "Input the quantity"
          }
        ])

        .then(function(answer){
            // get the information of the chosen item
            console.log(answer.choice)
            
            var chosenItem;
            for (var i = 0; i < res.length; i++) {
              if (res[i].product_name === answer.choice) {
                chosenItem = res[i];
              }
            }
            // determine if quantity to be purchased is less than the stock available
       
          if (parseInt(answer.bid) < chosenItem.stock_quantity ) {
              //if quantity is less than the stock quantity, calculate the new stock quantity
var newStock =(chosenItem.stock_quantity) -( answer.bid);
console.log(newStock)
               //update the database with the new database
                var query = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity  : newStock
                      },
                      {
                        item_id: chosenItem.item_id
                      }
                    ],
                function(err) {
                  if (err) throw err;
                  // inform the user the order was placed succefully
                  console.log("order placed successfully!");
                  start();
                }
              );
              console.log(query.sql);
            }
            // if the quantity is more than the stock_quantity available then don't place the order
            else if(chosenItem.stock_quantity > parseInt(answer.bid)) 
            {
              // inform the user there no enough product and start again
              console.log("We don't have enoung products for your order...");
              start();
            }
        
        })
          });
    }
start();