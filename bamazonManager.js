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
    cmd.run('clear');
    displayMenu();

});


function displayMenu() {
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'menu',
                message: 'Hello Manager! \nWhat do you want to do?',
                choices: [
                    'View Products for Sale',
                    'View Low Inventory',
                    'Add to Inventory',
                    'Add New Product',
                    'Exit'
                ]
            }
        ])
        .then(function (answer) {
            switch (answer.menu) {
                case 'View Products for Sale':
                    console.log(answer.menu);
                    displayProducts(1);
                    break;

                case 'View Low Inventory':
                    displayLowInventory();
                    break;

                case 'Add to Inventory':
                    addToInventory();
                    break;

                case 'Add New Product':
                    addProduct();
                    break;

                case 'Exit':
                    connection.end();
                    break;
            }
        });
}

function displayProducts(menuFlag) {
    cmd.run('clear');
    connection.query("SELECT * FROM bamazon.products", function (err, res) {
        if (err) throw err;
        console.table(res);
        if (menuFlag) displayMenu();
        //   connection.end();
    });
}

function displayLowInventory() {
    connection.query("SELECT * FROM bamazon.products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        if (res == '') { console.log("Inventory up to date!\n") }
        else { console.table(res) }
        displayMenu();
        //   connection.end();
    });
}

function addToInventory() {
    cmd.run('clear');
    connection.query("SELECT * FROM bamazon.products", function (err, res) {
        if (err) throw err;
        console.table(res);

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'item_id',
                    message: 'Enter item_id for the product you want to add : ',
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    type: 'input',
                    name: 'quantity',
                    message: 'Enter quantity to be added : ',
                    validate: function (value) {
                        if (isNaN(value) === false || value > 0) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                connection.query(
                    "UPDATE bamazon.products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
                    [answer.quantity, answer.item_id],
                    function (err) {
                        if (err) throw err;
                        console.log("The inventory was updated successfully!\n");
                        displayProducts(1);
                    }
                );
            });
    });
}


function addProduct() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'product',
                message: 'Enter Product Name : '
            },
            {
                type: 'input',
                name: 'department',
                message: 'Enter Department Name : '
            },
            {
                type: 'input',
                name: 'price',
                message: 'Enter Product Price : ',
                validate: function (value) {
                    if (isNaN(value) === false || value > 0) {
                        return true;
                    }
                    return false;
                }
            },
            {
                type: 'input',
                name: 'stock',
                message: 'Enter Stock Quantity : ',
                validate: function (value) {
                    if (isNaN(value) === false || value > 0) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO bamazon.products SET ?",
                {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your product was added successfully!");
                    // re-prompt the user for if they want to bid or post
                    cmd.run('clear');
                    displayProducts(1);
                }
            );
        });
}