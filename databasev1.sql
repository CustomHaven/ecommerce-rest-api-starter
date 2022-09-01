CREATE TABLE IF NOT EXISTS users (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  email varchar(50) UNIQUE,      
  password text,
  is_admin boolean,
  first_name varchar(50), -- CUSTOMER TABLE
  last_name varchar(50), -- CUSTOMER TABLE
  google_id varchar(255),
  facebook_id varchar(255)
);

CREATE TABLE IF NOT EXISTS dealers (
  did integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  name varchar(50),
  description text
);

CREATE TABLE IF NOT EXISTS dealer_products (
  dpid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  dealers_did integer REFERENCES dealers (did),
  product_name varchar(100),
  type varchar(50),
  description text,
  price numeric,
  quantity integer
);

CREATE TABLE IF NOT EXISTS store_products (
  spid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  dealer_product_dpid integer REFERENCES dealer_products (dpid),
  product_name varchar(100),
  type varchar(50),
  description text,
  price numeric,
  quantity integer
);

CREATE TABLE IF NOT EXISTS customers (
  cid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  first_name varchar(50), -- USER TABLE
  last_name varchar(50),  -- USER TABLE
  address varchar(100),
  zip_code varchar(25),
  city varchar(50),
  country varchar(50),
  email varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_list (
  customers_cid integer REFERENCES customers (cid),
  store_products_spid integer REFERENCES store_products (spid),
  quantity integer,
  order_date date
);

CREATE TABLE IF NOT EXISTS orders (
  oid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  customers_cid integer REFERENCES customers (cid),
  status_completed boolean,
  created_at timestamp,
  final_price numeric
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

ALTER TABLE order_list
ALTER COLUMN order_date TYPE timestamp(0) USING order_date::timestamp(0);

ALTER TABLE order_list
ALTER COLUMN order_date TYPE timestamp(0) USING order_date::timestamp(0);