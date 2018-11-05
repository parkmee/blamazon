const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "blamazonDB"
});

connection.connect(err => {
    if (err) throw err;
    console.log(`Welcome, customer #${connection.threadId}!`);
    seeProducts();
});

const seeProducts = () => {
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        console.table(res);
        buyProducts(res);
    });
}

const buyProducts = (products) => {
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
        for (i in products) {
            const p = products[i];
            if (p.item_id == ans.itemId) {
                if (p.stock_quantity >= ans.buyAmt) {
                    const newQty = p.stock_quantity - ans.buyAmt;
                    connection.query("UPDATE products SET ? WHERE ?",
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
                            const cost = parseFloat(ans.buyAmt * p.price);
                            console.log(`\nYour purchase of ${ans.buyAmt} ${p.product_name} ($${p.price}/each) cost $${cost}`);
                            connection.end();
                        }
                    );
                } else {
                    console.log(`\nInsufficient quantity of ${p.product_name} in stock. Please try again.\n`);
                    seeProducts();
                }
            }
        }
        
    });
}
