CREATE DATABASE blamazonDB;

USE blamazonDB;

CREATE TABLE products(
    item_id integer auto_increment not null primary key,
    product_name varchar(30) not null,
    department_name varchar(30),
    price decimal(7,2),
    stock_quantity integer(5)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
('Blamazon Ecco', 'Electronics', 149.99, 350),
('Joy of Cooking', 'Books', 79.89, 225),
('Meow Mix', 'Pet Products', 14.50, 660),
('Frozen', 'Entertainment', 19.99, 267),
('The Stepford Wives', 'Books', 7.58, 143),
('Nintendo Wii', 'Electronics', 148.90, 466),
('La Croix', 'Groceries', 5.79, 1536),
('Super Freakonomics', 'Books', 17.99, 233),
('Spaceballs', 'Entertainment', 9.99, 1320),
('Samsung Note 5', 'Electronics', 599.99, 185),
('Cat bed', 'Pet Products', 14.35, 89);