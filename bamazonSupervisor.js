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
    password: "Semester90@",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.table("connected as id " + connection.threadId);
    displayMenu();

});


function displayMenu() {
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'menu',
                message: 'Hello Supervisor! \nWhat do you want to do?',
                choices: [
                    'View Product Sales by Department',
                    'Create New Department',
                    'Exit'
                ]
            }
        ])
        .then(function (answer) {
            switch (answer.menu) {
                case 'View Product Sales by Department':
                    console.log(answer.menu);
                    displayDepartments(1);
                    break;

                case 'Create New Department':
                    addDepartment();
                    break;

                case 'Exit':
                    connection.end();
                    break;
            }
        });
}


function displayDepartments(menuFlag) {
    var query = 'SELECT d.department_id '
    query = query + ', d.department_name , d.over_head_costs , IFNULL(SUM(p.product_sales),0) as product_sales '
    query = query + ', IFNULL(SUM(p.product_sales),0) - d.over_head_costs as profit '
    query = query + 'FROM bamazon.departments d '
    query = query + 'LEFT JOIN bamazon.products p '
    query = query + 'ON (d.department_name = p.department_name) '
    query = query + 'GROUP BY d.department_id, d.department_name, d.over_head_costs;'

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        if (menuFlag) displayMenu();
        //   connection.end();
    });
}


function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Enter Department Name : '
            },
            {
                type: 'input',
                name: 'price',
                message: 'Enter Overhead Costs : ',
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
                "INSERT INTO bamazon.departments SET ?",
                {
                    department_name: answer.department,
                    over_head_costs: answer.price
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your department was added successfully!");
                    // re-prompt the user for if they want to bid or post
                    displayDepartments(1);
                }
            );
        });
}