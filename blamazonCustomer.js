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
    console.log(`Connection ID: ${connection.threadId}`);
    seeProducts();
});

const seeProducts = () => {
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        console.table(res);
        getProducts(res);
    });
    connection.end();
}

const getProducts = (products) => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the item_id of the product you would like to buy?',
            name: 'itemId'
        },
        {
            type: 'input',
            message: 'How many units of the product would you like to buy?',
            name: 'purchaseAmt'
        }
    ]).then(ans => {
        console.log(ans.itemId);
        const index = products.map(function(x) {
            return x.id;
        }).indexOf(ans.itemId);
        console.log(index);
        console.log(products);
        console.log(products[index]);
        //console.log(res);
    })
}
