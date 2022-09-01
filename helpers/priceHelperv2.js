const priceHelperV2 = (table1, table2, table1ID, table2ID, table3Col, price, quantity) => {
    const query = [`SELECT `];
    query.push(`${table1}.${price} * ${table2}.${quantity} AS price `);
    query.push(`FROM ${table1} `);
    query.push(`JOIN ${table2} `)
    query.push(`ON ${table1}.${table1ID} = ${table2}.${table2ID} `);
    query.push(`WHERE ${table2}.${table3Col} = $1;`);

    return query.join("");
};

module.exports = priceHelperV2;

// SELECT products.price * cart_list.quantity AS final_price FROM products JOIN cart_list ON products.id = cart_list.product_id WHERE cart_list.cart_id = 6;