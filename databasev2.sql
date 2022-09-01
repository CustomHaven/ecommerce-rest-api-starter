CREATE SEQUENCE IF NOT EXISTS user_seq
INCREMENT 1;

CREATE SEQUENCE IF NOT EXISTS prod_seq
INCREMENT 1;

CREATE SEQUENCE IF NOT EXISTS order_seq
INCREMENT 1;

CREATE TABLE IF NOT EXISTS users (
    id TEXT NOT NULL PRIMARY KEY DEFAULT concat_ws(' ', 'user', nextval('user_seq')),
    is_admin boolean NOT NULL,
    first_name varchar(50),
    last_name varchar(50),
    email varchar(50) UNIQUE,      
    password text NOT NULL,
    google_id varchar(255),
    facebook_id varchar(255),
    created date DEFAULT NOW()::timestamp,
    modified date DEFAULT NOW()::timestamp
);

CREATE TABLE IF NOT EXISTS contact_details (
    id bigserial NOT NULL PRIMARY KEY,
    user_id text REFERENCES users (id) ON DELETE CASCADE,
    address_line1 varchar(100) NOT NULL,
    address_line2 varchar(100),
    town_city varchar(100),
    zip_code varchar(25) NOT NULL,
    country varchar(100) NOT NULL,
    created date DEFAULT NOW()::timestamp,
    modified date DEFAULT NOW()::timestamp
);

CREATE TABLE IF NOT EXISTS products (
    id text NOT NULL PRIMARY KEY DEFAULT concat_ws(' ', 'prod', nextval('prod_seq')),
    source text,
    product_name varchar(100) NOT NULL,
    type varchar(100),
    description text,
    price numeric NOT NULL,
    quantity bigint NOT NULL,
    created date DEFAULT NOW()::timestamp,
    modified date DEFAULT NOW()::timestamp
);

CREATE TABLE IF NOT EXISTS product_images (
    id bigserial NOT NULL PRIMARY KEY,
    product_id text REFERENCES products (id) ON DELETE CASCADE,
    image_name varchar(255),
    image_data bytea NOT NULL,
    created date DEFAULT NOW()::timestamp,
    modified date DEFAULT NOW()::timestamp
);

CREATE TABLE IF NOT EXISTS carts (
    id bigserial NOT NULL PRIMARY KEY,
    user_id text NULL REFERENCES users (id) ON DELETE CASCADE,
    abandonded boolean NOT NULL DEFAULT true,
    created date DEFAULT NOW()::timestamp,
    modified date DEFAULT NOW()::timestamp
);

CREATE TABLE IF NOT EXISTS cart_list (
    id bigserial NOT NULL PRIMARY KEY,
    product_id text REFERENCES products (id) ON DELETE CASCADE,
    cart_id bigint REFERENCES carts (id) ON DELETE CASCADE,
    quantity bigint NOT NULL,
    created date DEFAULT NOW()::timestamp,
    modified date DEFAULT NOW()::timestamp
);

CREATE TABLE IF NOT EXISTS orders (
    id text NOT NULL PRIMARY KEY DEFAULT concat_ws(' ', 'order', nextval('order_seq')),
    user_id text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    cart_id bigint NOT NULL REFERENCES carts (id),
    shipping_status varchar(20) NOT NULL,
    final_price numeric NOT NULL,
    total_items bigint NOT NULL,
    tracking_id varchar(100) NOT NULL,
    created date DEFAULT NOW()::timestamp,
    modified date DEFAULT NOW()::timestamp
);

CREATE TABLE IF NOT EXISTS order_list (
    id bigserial NOT NULL PRIMARY KEY,
    product_id text REFERENCES products (id),
    order_id text REFERENCES orders (id),
    quantity bigint NOT NULL,
    price NUMERIC NOT NULL,
    created date DEFAULT NOW()::timestamp,
    modified date DEFAULT NOW()::timestamp
);

CREATE TABLE IF NOT EXISTS payment_details (
    id bigserial NOT NULL PRIMARY KEY,
    user_id text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name_on_card varchar(100) NOT NULL,
    card_type varchar(50) NOT NULL,
    card_number bpchar(24) NOT NULL,
    expiry_date varchar(10) NOT NULL,
    cvv smallint,
    created date DEFAULT NOW()::timestamp,
    modified date DEFAULT NOW()::timestamp
);

ALTER TABLE users
ALTER COLUMN created TYPE timestamp(0) USING created::timestamp(0),
ALTER COLUMN modified TYPE timestamp(0) USING modified::timestamp(0);

ALTER TABLE contact_details
ALTER COLUMN created TYPE timestamp(0) USING created::timestamp(0),
ALTER COLUMN modified TYPE timestamp(0) USING modified::timestamp(0);

ALTER TABLE products
ALTER COLUMN created TYPE timestamp(0) USING created::timestamp(0),
ALTER COLUMN modified TYPE timestamp(0) USING modified::timestamp(0);

ALTER TABLE product_images
ALTER COLUMN created TYPE timestamp(0) USING created::timestamp(0),
ALTER COLUMN modified TYPE timestamp(0) USING modified::timestamp(0);

ALTER TABLE carts
ALTER COLUMN created TYPE timestamp(0) USING created::timestamp(0),
ALTER COLUMN modified TYPE timestamp(0) USING modified::timestamp(0);

ALTER TABLE cart_list
ALTER COLUMN created TYPE timestamp(0) USING created::timestamp(0),
ALTER COLUMN modified TYPE timestamp(0) USING modified::timestamp(0);

ALTER TABLE order_list
ALTER COLUMN created TYPE timestamp(0) USING created::timestamp(0),
ALTER COLUMN modified TYPE timestamp(0) USING modified::timestamp(0);

ALTER TABLE orders
ALTER COLUMN created TYPE timestamp(0) USING created::timestamp(0),
ALTER COLUMN modified TYPE timestamp(0) USING modified::timestamp(0);

ALTER TABLE payment_details
ALTER COLUMN created TYPE timestamp(0) USING created::timestamp(0),
ALTER COLUMN modified TYPE timestamp(0) USING modified::timestamp(0);

CREATE TABLE IF NOT EXISTS session (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");