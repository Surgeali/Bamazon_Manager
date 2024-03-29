require('dotenv').config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var keys = require("./keys.js");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys.permissions.database,
    database: "bamazon_db"
});

function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole number (not zero).';
    }
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    allProducts();
});

//------- to list out all item ----------//
function allProducts() {
    console.log("\nHere are all of the products for sale..\n<--------------->");
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        askQuestion();
    });
}
//----- ^ to list out all item ^ ---------//

var askQuestion = function () {
    inquirer.prompt([
        {
            type: 'input',
            name: "item_id",
            message: "What is the product ID?",
            validate: validateInput,
            filter: Number
        },
        {
            type: 'input',
            name: "quantity",
            message: "How many would you like to purchase?",
            validate: validateInput,
            filter: Number
        }
    ]).then(function (answers) {

        var id = answers.item_id;
        var quantity = answers.quantity;

        var queryStr = 'SELECT * FROM products WHERE ?'

        connection.query(queryStr, { item_id: id }, function (err, data) {
            if (err) throw err;
            // console.log('data = ' + JSON.stringify(data));
            console.log("ID: " + data[0].item_id + "\nName: " + data[0].product_name + "\nPrice: " + data[0].price);
            console.log("---------------");
            gotUserInput(data, id, quantity)
        })
    })
}

function gotUserInput(data, id, quantity) {

    if (data.length === 0) {
        console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
        allProducts();
        return;
    }
    var productData = data[0];

    if (quantity <= productData.stock_quantity) {
        console.log('Placing order!');

        var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + id;
        // console.log('updateQueryStr = ' + updateQueryStr);

        // Update the inventory
        connection.query(updateQueryStr, function (err, data) {
            if (err) throw err;

            console.log('Your order has been placed! Your total is $' + productData.price * quantity);
            console.log('Thank you for shopping with us!');
            console.log("\n---------------------------------------------------------------------\n");

            // End the database connection
            connection.end();
        })
    } else {
        console.log("That's too many fool!");

        allProducts();
    }

}
