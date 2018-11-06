// invoking installed node package modules
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

const spacer = "***************************************************";
connection.connect(err=> {
    if (err) throw err;
    console.log(`
    ${spacer}
                    Blamazon - Manager View
    ${spacer}\n`);
    mgrMenu();
});

const mgrMenu = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Pick an Option:",
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "mgrChoice"
        }
    ]).then(ans => {
        connection.query("SELECT * FROM products", (err, res) => {
            if (err) throw err;

            switch (ans.mgrChoice) {
            case "View Products": 
                console.log("Viewing products...\n");
                viewProducts(res);
                break;
            case "View Low Inventory": 
                console.log("Viewing low inventory products...\n");
                lowInventory(res);
                break;
            case "Add to Inventory": 
                console.log("Adding inventory...\n");
                addInventory();
                break;
            case "Add New Product": 
                console.log("Adding new product...\n");
                addProduct(res);
                break;
            case "Exit": connection.end();
                break;
            }
        });
    });
}

const viewProducts = (products) => {
    console.table(products);
    setTimeout(mgrMenu, 2000);
}

const lowInventory = (products) => {


}

const addInventory = () => {

}

const addProduct = () => {
    const dept = [];
    connection.query("SELECT DISTINCT department_name FROM products", (err, res) => {
        if (err) throw err;
        for (i in res) {
            dept.push(res[i].department_name);
        }
    });

    inquirer.prompt([
        {
            message: "Enter product name: ",
            name: "productName"
        },
        {
            type: "list",
            message: "Select product department: ",
            choices: dept,
            name: "productDept"
        },
        {
            message: "Enter product unit price: ",
            name: "productPrice"
        },
        {
            message: "Enter product stock quantity: ",
            name: "productQty"
        }
    ]).then(ans => {
        console.log(ans);
        connection.query("INSERT INTO products SET ?", 
            {
                product_name: ans.productName,
                department_name: ans.productDept,
                price: ans.productPrice,
                stock_quantity: ans.productQty
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${ans.productName} added to the inventory`);
                mgrMenu();
            }
        );
    });
}
