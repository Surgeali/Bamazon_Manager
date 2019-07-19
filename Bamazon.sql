DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NULL,
price DECIMAL(10, 2) NULL,
stock_quantity INTEGER(10) NULL,
PRIMARY KEY (item_id)
);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone 5 charger", "electronics", 9.50, 25),
("iPhone 4s charger", "electronics", 7.50, 20),
("pillow", "home", 19.50, 25),
("bluetooth speakers", "electronics", 19.99, 50),
("blanket", "home", 9.50, 25),
("hammer", "hardware", 10.50, 10),
("screwdriver", "hardware", 4.50, 5),
("curtains", "home", 49.99, 10),
("laptop", "electronics", 699.99, 5),
("almonds", "grocery", 10.99, 40);

SELECT * FROM products