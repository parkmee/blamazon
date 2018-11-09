// invoke installed node packages modules
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// set parameters to connect to mysql server
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "blamazonDB"
});

// connection to mysql server
const spacer = "***************************************************";
connection.connect(err => {
    if (err) throw err;
    console.log(`
    ${spacer}
                Blamazon - Supervisor View
    ${spacer}\n`);
    superMenu();
});

// show menu of options for supervisor
const superMenu = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Choose an option",
            choices: ["View Product Sales by Department", "Add New Department", "Exit"],
            name: "superOption"
        }
    ]).then((ans) => {
        switch (ans.superOption) {
            case "View Product Sales by Department": viewSales();
            break;
            case "Add New Department": addDept();
            break;
            case "Exit": connection.end();
        }
    });
}

// show sales for all departments
// new departments will have null sales and profit values
const viewSales = () => {
    connection.query(`
    SELECT 	departments.department_id AS DeptID, 
            departments.department_name AS Department, 
            over_head_costs AS Overhead,
            product_sales AS Sales, 
            (product_sales - over_head_costs) AS Profit
    FROM products 
    RIGHT JOIN departments on products.department_id = departments.department_id
    GROUP BY departments.department_name;`,
    (err, res) => {
        if (err) throw err;
        console.log('\n')
        console.table(res);
        superMenu();
        }
    );
}

// run prompt to add new department
const addDept = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter new department name",
            name: "newDept",
            validation: value => {
                if (value) {
                    return true;
                } else {
                    console.log("\nYou must enter a value");
                    return;
                }
            }
        },
        {
            type: "input",
            message: "Enter overhead costs",
            name: "overhead",
            validation: value => {
                const pass = value.match(/[0-9]+/g);
                if (pass && value > 0) {
                    return true;
                } else {
                    console.log("\nPlease enter a number greater than 0");
                    return;
                }
            }
        }
    ]).then(ans => {
        connection.query(`INSERT INTO departments SET ?`, // enter new record into departments table
            {
                department_name: ans.newDept,
                over_head_costs: ans.overhead
            },
            (err, res) => {
                if (err) throw err;
                superMenu();
            } 
        );
    });
}