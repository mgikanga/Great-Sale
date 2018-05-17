CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products(
item_id INTEGER(50) NOT NULL AUTO_INCREMENT, 
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price INTEGER(50) NOT NULL,
stock_quantity INTEGER(50) NOT NULL,
PRIMARY KEY(item_id)
)

INSERT INTO products(item_id, product_name, department_name,price,stock_quantity)
VALUES ("Lego", "Toys", 50, 100), ("Fridge", "Appliances",500,60), ("Computer", "Electronics",350,100),
("NB", "shoes",120,500), ("Drier", "Appliance", 1200, 50),("Printer","Electronics", 80, 79),("Barbie","Toys",50,80),
("Code Complete","Books",100,15),("Car Seat","Kids",600,20),("Drill","Tools",140,40);

