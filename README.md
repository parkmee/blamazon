# BLAMAZON
This application enables customers to view an inventory of items with their department, price, and available stock and to purchase these items if desired. Managers have the ability to view the inventory list, identify items with less than five units available, order units of an existing product, and purchase new products. Finally, supervisors can view sales per department and add new departments as needed.

## Getting Started

### Customer
Start the customer service app by entering [node blamazonCustomer.js](assets/images/customerStart.PNG) on the command line. An [inventory table](assets/images/customerInventory.PNG) is displayed upon opening the app. Customers are [prompted](assets/images/customerPurchase.PNG) to enter the product ID and number of units they wish to purchase. Upon purchasing, the total cost of goods is displayed. An [updated view of the inventory table](assets/images/customerInventoryUpdate.PNG) reflects the reduced quantity of the item just purchased. Customers can choose to continue to buy items or to [exit](assets/images/customerExit.PNG) the customer app.

### Manager

Start the manager app by entering [node blamazonManager.js](assets/images/managerStart.PNG) to show the menu of options. Managers can
[view products](assets/images/managerView.PNG), 
[view items with low inventory](assets/images/managerLowInventory.PNG), [stock inventory](assets/images/managerStock.PNG), and [add new products](assets/images/managerAddNewProduct.PNG) to the [inventory table](assets/images/managerUpdatedInventory.PNG). Finally, managers can exit from the menu.

### Supervisor
Start the supervisor app by entering [node blamazonSupervisor.js](assets/imagessupervisorStart.PNG) to show the menu of options. Supervisors can [view a table](assets/images/supervisorSales.PNG) of overhead, sales, and profit by department. Newly created departments without corresponding products in that department will have null values for sales and profit. [New departments](assets/images/supervisorNewDept.PNG) can be added by entering its name and overhead cost. Choose exit to close the program.

## Built With

* Javascript
* jQuery
* Node.js
* Node module packages
    * mysql
    * inquirer
    * console.table

## Links

[https://github.com/parkmee/blamazon](https://github.com/parkmee/blamazon)

## Authors

* **Meeyoung Park** - [parkmee](https://github.com/parkmee)