const { Client } = require('pg');
const { DB } = require('./config');

(async () => {
    const userSequence = `
        CREATE SEQUENCE IF NOT EXISTS user_seq
        INCREMENT 1;
    `
    const users = `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY NOT NULL DEFAULT concat_ws(' ', 'user', nextval('user_seq')),
            email varchar(50) UNIQUE,      
            password text NOT NULL,
            is_admin boolean,
            first_name varchar(50),
            last_name varchar(50),
            google_id varchar(255),
            facebook_id varchar(255)
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
            price numeric,
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
            price numeric,
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
            city varchar(50),
            country varchar(50),
            email varchar(50) NOT NULL
        );
    `

    const order_list = `
        CREATE TABLE IF NOT EXISTS order_list (
            customers_cid integer REFERENCES customers (cid),
            store_products_spid integer REFERENCES store_products (spid),
            quantity integer,
            order_date date
        );
    `

    const orders = `
        CREATE TABLE IF NOT EXISTS orders (
            oid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            customers_cid integer REFERENCES customers (cid),
            status_completed boolean,
            created_at timestamp,
            final_price numeric
        );
    `

    const session = `
        CREATE TABLE IF NOT EXISTS session (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
        )
        WITH (OIDS=FALSE);
    `

    const alterSession = `
        ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    `

    const indexSession = `
        CREATE INDEX "IDX_session_expire" ON "session" ("expire");
    `

    const orderListTime = `
        ALTER TABLE order_list
        ALTER COLUMN order_date TYPE timestamp(0) USING order_date::timestamp(0);
    `

    const orderTime = `
        ALTER TABLE order_list
        ALTER COLUMN order_date TYPE timestamp(0) USING order_date::timestamp(0);
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
        await db.query(userSequence);
        await db.query(session);
        await db.query(users);
        await db.query(dealers);
        await db.query(dealer_products);
        await db.query(store_products);
        await db.query(customers);
        await db.query(order_list);
        await db.query(orders);

        await db.query(alterSession);
        await db.query(indexSession);

        await db.query(orderListTime);
        await db.query(orderTime);

        await db.end();

    } catch(err) {
        console.log("ERROR CREATING ONE OR MORE TABLES: ", err)
    }
})();



/*

INSERT INTO users (email, password, is_admin, first_name, last_name, google_id, facebook_id)
VALUES ('rihan@email.com', 'ri123', false, 'ri', 'mo', 'googleid', 'facebookid');

*/