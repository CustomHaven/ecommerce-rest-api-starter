const { Client } = require('pg');
const { DB } = require('./config');

(async () => {
    const users = `
        CREATE TABLE IF NOT EXISTS users (
            id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            email varchar(50),      
            password text,
            first_name varchar(50),
            last_name varchar(50),
            google json,
            facebook json
        );
    `
    const dealers = `
        CREATE TABLE IF NOT EXISTS dealers (
            did integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            name varchar(50),
            description text
        );
    `
    const dealer_products = `
        CREATE TABLE IF NOT EXISTS dealer_products (
            dpid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            dealers_did integer REFERENCES dealers (did),
            product_name varchar(100),
            type varchar(50),
            description text,
            price money,
            quantity integer
        );
    `
    const store_products = `
        CREATE TABLE IF NOT EXISTS store_products (
            spid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            dealer_product_dpid integer REFERENCES dealer_products (dpid),
            product_name varchar(100),
            type varchar(50),
            description text,
            price money,
            quantity integer
        );
    `

    const customers = `
        CREATE TABLE IF NOT EXISTS customers (
            cid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            first_name varchar(50),
            last_name varchar(50),
            address varchar(100),
            zip_code varchar(25),
            country varchar(50),
            email varchar(50) NOT NULL
        );
    `

    const ordered_items = `
        CREATE TABLE IF NOT EXISTS ordered_items (
            customers_cid integer REFERENCES customers (cid),
            store_products_spid integer REFERENCES store_products (spid),
            PRIMARY KEY (customers_cid, store_products_spid),
            quantity integer,
            order_date date
        );
    `

    const orders = `
        CREATE TABLE IF NOT EXISTS orders (
            oid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            customers_cid integer REFERENCES customers (cid),
            status_completed boolean,
            created_at date,
            final_price money
        );
    `


    try {
        const db = new Client({
            host: DB.PGHOST,
            user: DB.PGUSER,
            database: DB.PGDATABASE,
            password: DB.PGPASSWORD,
            port: DB.PGPORT
        });
        
        await db.connect();

        // Creating tables on database

        await db.query(users);
        await db.query(dealers);
        await db.query(dealer_products);
        await db.query(store_products);
        await db.query(customers);
        await db.query(ordered_items);
        await db.query(orders);

        await db.end();

    } catch(err) {
        console.log("ERROR CREATING ONE OR MORE TABLES: ", err)
    }
})();