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
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected");
})

inquirer
    .prompt({
        name: "manager",
        type: "rawlist",
        message: "Would you like to do today?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
    .then(function (answer) {
        // based on their answer, call function to accordingly
        if (answer.manager.toUpperCase() === "View Products for Sale") {
            allProducts()
        }
        else if ((answer.manager.toUpperCase() === "View Low Inventory")) {
            lowInventory()
        }
        else if ((answer.manager.toUpperCase() === "Add to Inventory")) {
            addInventory()
        }
        else if ((answer.manager.toUpperCase() === "Add New Product")) {
            newProduct()
        }
    });
//function to view everything 
function allProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("Item_id", "|", "product_name", "|", "Department_name", "|", "price", "|", "stock")
        console.log("--------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {

            var results = (res[i].item_id + "       | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity)

            console.log(results)
            console.log("------------------------------------------------");
            connection.end();
        }
    });
}


// function to display items low on inventory
function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            var inventory = (res[i].stock_quantity);
            if (inventory < 5) {
                console.log("items with low inventory");
                console.log(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity)
            }
            else if ((inventory > 5)) {
                console.log("Everything has enough Enough Inventory ")
                connection.end();
            }
        }
    })
}

// function to add inventory
function addInventory() {
    // query the database for all items for sale
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which item they would like to update
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What item would you like to inventory to?"
                },
                {
                    name: "inventory",
                    type: "input",
                    message: "How many would you like to add?"
                }
            ])

            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                console.log(chosenItem.stock_quantity)
                var newInventory = (chosenItem.stock_quantity) + (parseInt(answer.inventory))
                console.log(newInventory);
                // update the database
                var query = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newInventory
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function (error) {
                        if (error) throw error;
                        console.log("inventory updated successfully!");
                        connection.end();

                    }

                );
                console.log(query.sql)
            });
    });
}

//function to add new product
function newProduct() {

    // prompt for info about the item being added
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the item you would like to add?"
            },
            {
                name: "category",
                type: "input",
                message: "What department would you like to place your item in?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of the item?"
            },
            {
                name: "inventory",
                type: "input",
                message: "What is the quantity of the this item?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.item,
                    department_name: answer.category,
                    price: answer.price,
                    stock_quantity: answer.inventory
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your have added item successfully!");
                    connection.end();

                }
            );
        });

}
