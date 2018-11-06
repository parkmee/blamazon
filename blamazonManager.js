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
connection.connect(err=> { // connect to mysql server
    if (err) throw err;
    console.log(`
    ${spacer}
                    Blamazon - Manager View
    ${spacer}\n`);
    mgrMenu(); // goto function to run menu
});

const mgrMenu = () => { // show menu
    inquirer.prompt([ // prompt user for menu selection
        {
            type: "list",
            message: "Pick an Option:",
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "mgrChoice"
        }
    ]).then(ans => { // goto function based on user entry
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
                addInventory(res);
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

const viewProducts = (products) => { // show table of products
    console.table(products);
    setTimeout(mgrMenu, 1000);
}

const lowInventory = (products) => { // show table of products with inventory <5 units
    const lowInventory = [];
    for (i in products) {
        if (products[i].stock_quantity < 5) {
            lowInventory.push(products[i]); // create array of products with <5 units
        }
    }
    console.table(lowInventory); // print table of low inventory products
    setTimeout(mgrMenu, 1000); // revert to manager menu after 1 sec
}

const addInventory = (products) => { // add products to database
    console.table(products); // show table of products

    inquirer.prompt([ // prompt user to select product and quantity to add
        {
            message: "Enter product id: ",
            name: "itemId"
        },
        {
            message: "Enter number of units to add: ",
            name: "productQty"
        }
    ]).then(ans => {
        let itemMatch = false; // indicator to check for valid product id

        for (i in products) {
            const p = products[i];
            if (p.item_id == ans.itemId) { // checks if id user entered matched id in database
                itemMatch = true; // set indicator to true if match
                const newQty = p.stock_quantity + parseInt(ans.productQty); // calculate new qty of stock
                connection.query("UPDATE products SET ? WHERE ?", // update table with new quantity where id matches
                    [
                        {
                            stock_quantity: newQty
                        },
                        {
                            item_id: p.item_id
                        }
                    ], (err, res) => {
                        if (err) throw err;
                        console.log(`\nYou have ${newQty} units of ${p.product_name} in your inventory\n`);
                        mgrMenu();    
                    }
                );
            }
        }
        if (!itemMatch) { // if no id match is found, print error message and restart function
            console.log("Enter a valid item ID");
            addInventory(products);
        }
    });
}

const addProduct = () => { // add new product to product table
    let dept = [];
    connection.query("SELECT DISTINCT department_name FROM products", (err, res) => {
        if (err) throw err;
        for (i in res) {
            dept.push(res[i].department_name); // add unique department names to dept array
        }
    });

    inquirer.prompt([ // prompt user for product name, department, price, and qty
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
        connection.query("INSERT INTO products SET ?", // add new record to products table based on user entries
            {
                product_name: ans.productName,
                department_name: ans.productDept,
                price: ans.productPrice,
                stock_quantity: ans.productQty
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${ans.productName} added to the inventory`);
                mgrMenu(); // revert to main manager menu
            }
        );
    });
}
