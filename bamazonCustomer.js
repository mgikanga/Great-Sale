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
function start() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
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
            // determine if bid was high enough
       
          if (parseInt(answer.bid) < chosenItem.stock_quantity ) {
              // bid was high enough, so update db, let the user know, and start over
              console.log(answer.bid)
              console.log(chosenItem.stock_quantity);
var newStock =(chosenItem.stock_quantity) -( answer.bid);
console.log(newStock)
                 
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
                  console.log("order placed successfully!");
                  start();
                }
              );
              console.log(query.sql);
            }
            else if(chosenItem.stock_quantity > parseInt(answer.bid)) 
            {
              // bid wasn't high enough, so apologize and start over
              console.log("We don't have enoung products for your order...");
              start();
            }
        
        })
          });
    }
start();