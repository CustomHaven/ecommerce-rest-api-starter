INSERT INTO store_products 
VALUES (6, 6, 'Rustic Wooden Wall', 'Storage', 'Hang, Hang and Hang AWAY!!', (SELECT price * 3 FROM supplier_products WHERE id = 6), 995);

            -- dpid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            -- dealers_did integer REFERENCES dealers (did),
            -- product_name varchar(100),
            -- type varchar(50),
            -- description text,
            -- price money,
            -- quantity integer


INSERT INTO dealer_products (product_name, type, description, price, quantity) VALUES ('Muffin Mix - Corn Harvest', 'Food', 'Wine - Rosso Del Veronese Igt', 8.34, 2057);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES (4, 'Nantucket - Pomegranate Pear', 'Food', 'Remy Red', 4.19, 1626);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES (4, 'Cup - Translucent 7 Oz Clear', 'Food', 'Absolut Citron', 7.91, 2693);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES (3, 'Veal - Kidney', 'Food', 'Lettuce - Romaine', 1.54, 2230);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES (3, 'Sea Urchin', 'Food', 'Five Alive Citrus', 7.46, 3329);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES (6, 'Munchies Honey Sweet Trail Mix', 'Food', 'Quiche Assorted', 3.90, 1572);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Gatorade - Orange', 'Food', 'Beer - Maudite', '$0.43', 1662);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Ice Cream Bar - Hagen Daz', 'Food', 'Pear - Halves', '$8.04', 1551);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Beans - Green', 'Food', 'Vodka - Hot, Lnferno', '$2.55', 2060);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Juice - Ocean Spray Cranberry', 'Food', 'Sauce - Plum', '$1.28', 3125);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Daikon Radish', 'Food', 'Lotus Leaves', '$1.52', 2040);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Coffee - Decaffeinato Coffee', 'Food', 'Cauliflower', '$6.15', 3563);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Cheese - Perron Cheddar', 'Food', 'Cake - Miini Cheesecake Cherry', '$7.28', 3104);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Nantucket - 518ml', 'Food', 'Pears - Anjou', '$6.07', 1755);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Ecolab - Hobart Upr Prewash Arm', 'Food', 'Beer - Sleeman Fine Porter', '$8.68', 725);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Trout Rainbow Whole', 'Food', 'Beef Flat Iron Steak', '$7.77', 2748);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Coffee - 10oz Cup 92961', 'Food', 'Extract - Raspberry', '$7.94', 873);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Chevere Logs', 'Food', 'Calypso - Strawberry Lemonade', '$8.66', 991);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Beer - Rickards Red', 'Food', 'Muffin Orange Individual', '$0.75', 2137);
INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES ((SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int), 'Soda Water - Club Soda, 355 Ml', 'Food', 'Potatoes - Peeled', '$0.56', 1894);
 

SELECT CAST(FLOOR(RAND()*(SELECT COUNT(*) FROM dealers) + 1) AS int) ;

(SELECT d.description FROM dealers AS d, dealer_products AS dp WHERE dp.dealers_did = d.did);


SELECT
  constraint_name, table_name, column_name
FROM
  information_schema.key_column_usage
WHERE
  table_name IN ('dealer_products');

UPDATE dealer_products
SET dealers_did = 4
WHERE dpid = 1;

SELECT
  column_name, data_type
FROM
  information_schema.columns
WHERE
  table_name IN ('dealer_products');


ALTER TABLE store_products
ALTER COLUMN price TYPE NUMERIC;




INSERT INTO dealer_products (dealers_did, product_name, type, description, price, quantity) VALUES (29, 'Baked Beans', 'Food', 'Many beautiful exotic beans', 1.99, 1203);