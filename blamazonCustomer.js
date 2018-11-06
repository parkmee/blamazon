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
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        console.table(res);
        buyProducts(res); // run function to purchase products
    });
}

// purchase products
const buyProducts = (products) => {
    // get user input on the number of an item to purchase
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the ID of the product you would like to buy?',
            name: 'itemId'
        },
        {
            type: 'input',
            message: 'How many units of the product would you like to buy?',
            name: 'buyAmt'
        }
    ]).then(ans => {
        let itemMatch = false; // indicator to determine if the user has selected a valid item

        for (i in products) {
            const p = products[i];
            if (p.item_id == ans.itemId) { // checks to see if entered ID exists in database
                itemMatch = true; // set to true if id is matched
                if (p.stock_quantity >= ans.buyAmt) { // check to see if sufficient supply vs ordered amt
                    const newQty = p.stock_quantity - ans.buyAmt; // calculate remaining stock after purchase
                    connection.query("UPDATE products SET ? WHERE ?", // set new quantity for the selected item_id
                        [
                            {
                                stock_quantity: newQty
                            },
                            {
                                item_id: p.item_id
                            }
                        ],
                        (err, res) => {
                            if (err) throw err;
                            const cost = parseFloat(ans.buyAmt * p.price); // calculate cost
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
}
