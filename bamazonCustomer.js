var mysql = require('mysql');
const cTable = require('console.table');
var inquirer = require("inquirer");
var cmd=require('node-cmd');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.table("connected as id " + connection.threadId);
    displayProducts();

});


function displayProducts() {
    cmd.run('clear');
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products", function (err, res) {
        if (err) throw err;
        console.table(res);
        customerOrder();
        //   connection.end();
    });
}

function customerOrder() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: "Enter item_id of the product you'd like to buy: ",
            default: 1,
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: 'input',
            name: 'units',
            message: "Enter number of units you'd like to buy: ",
            default: 0,
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {

        connection.query(
          "UPDATE bamazon.products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ?*price WHERE item_id = ? AND stock_quantity >=  ?",
          [answer.units, answer.units, answer.item_id, answer.units],
          function(err, results) {
            if (err) throw err;
            cmd.run('clear');
            if(results.affectRows>0)
            {console.log("Your order was placed successfully!\n");}
            else{console.log("Stock not sufficient for this product!\n");}
            displayProducts();
          }
        );
      });
}

