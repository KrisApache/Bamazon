
DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

use bamazon;

create table products(
	item_id INT auto_increment NOT NULL,
    product_name varchar(100) NOT NULL,
    department_name varchar(50) NOT NULL,
    price decimal(8,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales decimal(8,2) NOT NULL default 0.0,
    primary key(item_id)
);

create table departments(
	department_id INT auto_increment NOT NULL,    
    department_name varchar(50) NOT NULL,
    over_head_costs decimal(8,2) NOT NULL DEFAULT 200,  
    primary key(department_id)
);


INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Haagen Daz Icecream','Food',18.95,50),
('Sourdough Bread','Food',15.95,50),
('Buffalo Chicken Pizza','Food',23.15,20),
('Quakers Oatmeal','Food',8.60,100),
('Diesel Jeans','Clothing',215.40,35),
('Bonobos Suit','Clothing',440.00,12),
('Dress Shirt','Clothing',85.48,30),
('MacBook Air','Electronics',1350.00,20),
('PlayStation 4','Electronics',400.20,50),
('Samsung Galaxy S9','Electronics',900,50);

INSERT INTO departments(department_name, over_head_costs)
VALUES('Food', 200),
('Clothing', 500),
('Electronics',1000);