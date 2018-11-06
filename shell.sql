DROP DATABASE IF EXISTS blamazonDB;

CREATE DATABASE blamazonDB;

USE blamazonDB;

CREATE TABLE departments(
    department_id integer auto_increment not null primary key,
    department_name varchar(30) not null,
    over_head_costs decimal(10,2)
);

CREATE TABLE products(
    item_id integer auto_increment not null primary key,
    product_name varchar(30) not null,
    department_name varchar(30),
    department_id integer,
    price decimal(7,2),
    stock_quantity integer(5),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

INSERT INTO departments (department_name, over_head_costs) VALUES
('Electronics', 55000.00),
('Books', 20000.00),
('Pet Products', 25000.00),
('Entertainment', 32000.00),
('Groceries', 28450.00);

INSERT INTO products (product_name, department_name, department_id, price, stock_quantity) VALUES
('Blamazon Ecco', 'Electronics', 1, 149.99, 350),
('Joy of Cooking', 'Books', 2, 79.89, 225),
('Meow Mix', 'Pet Products', 3, 14.50, 660),
('Frozen', 'Entertainment', 4, 19.99, 267),
('The Stepford Wives', 'Books', 2, 7.58, 143),
('Nintendo Wii', 'Electronics', 1, 148.90, 466),
('La Croix', 'Groceries', 5, 5.79, 1536),
('Super Freakonomics', 'Books', 2, 17.99, 233),
('Spaceballs', 'Entertainment', 4, 9.99, 1320),
('Samsung Note 5', 'Electronics', 1, 599.99, 185),
('Cat bed', 'Pet Products', 3, 14.35, 89);

ALTER TABLE products
ADD product_sales decimal(10,2);

