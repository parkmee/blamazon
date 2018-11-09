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
// connect to sql server
connection.connect(err => {
    if (err) throw err;
    console.log(`
    ${spacer}
                    Welcome to Blamazon!
    ${spacer}\n`);
    seeProducts();
});

const menu = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Buy", "Exit"],
            name: "menuChoice"
        }
    ]).then(ans => {
        switch (ans.menuChoice) {
            case "Buy": seeProducts();
            break;
            case "Exit": connection.end();
            break;
        } 
    });
}

const seeProducts = () => {
    // print product table
    connection.query(`
    SELECT item_id, product_name, departments.department_name, price, stock_quantity FROM products 
    LEFT JOIN departments 
    ON products.department_id = departments.department_id`, 
    (err, res) => {
        if (err) throw err;
        console.table(res);
        buyProducts(); // run function to purchase products
    });
    /* connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        console.table(res);
        buyProducts(res); // run function to purchase products
    }); */
}

// purchase products
const buyProducts = () => {
    connection.query(`
    SELECT item_id, product_name, stock_quantity, price, product_sales FROM products`, (err, products) => {
        if (err) throw err;
        
        // get user input on the number of an item to purchase
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the ID of the product you would like to buy?',
                name: 'itemId',
                validate: (value) => {
                    const pass = value.match(/[0-9]/g);
                    if (pass && value > 0) {
                        return true;
                    } else {
                        console.log("\nPlease enter a number");
                        return;
                    }
                }
            },
            {
                type: 'input',
                message: 'How many units of the product would you like to buy?',
                name: 'buyAmt',
                validate: (value) => {
                    const pass = value.match(/[0-9]+/g);
                    if (pass && value > 0) {
                        return true;
                    } else {
                        console.log("\nPlease enter a number");
                        return;
                    }
                }
            }
        ]).then(ans => {
            let itemMatch = false; // indicator to determine if the user has selected a valid item

            for (i in products) {
                const p = products[i];
                if (p.item_id == ans.itemId) { // checks to see if entered ID exists in database
                    itemMatch = true; // set to true if id is matched

                    if (p.stock_quantity >= ans.buyAmt) { // check to see if sufficient supply vs ordered amt
                        const newQty = p.stock_quantity - ans.buyAmt; // calculate remaining stock after purchase
                        // console.log(newQty);
                        const cost = parseFloat(ans.buyAmt * p.price); // calculate cost
                        const sales = p.product_sales + cost;
                        // console.log(sales);

                        // set new quantity for the selected item_id
                        connection.query(`
                        UPDATE products 
                        SET stock_quantity = ${newQty}, product_sales = ${sales} 
                        WHERE item_id=${p.item_id}`, (err, res) => {
                                if (err) throw err;
                                console.log(`\nYour purchase of ${ans.buyAmt} ${p.product_name} ($${p.price}/each) cost $${cost}\n`);
                                menu(); // show menu options
                            }
                        );
                    } else { // if stock is insufficient
                        console.log(`\nInsufficient quantity of ${p.product_name} in stock. Please try again.\n`);
                        buyProducts(products); // ask customer to reenter item and qty for purchase
                    }
                }
            }
            if (!itemMatch) { // if item id invalid
                console.log("\nYou entered an invalid product ID.\n");
                buyProducts(products); // ask customer to reenter item and qty for purchase
            }
        });
    });
}
