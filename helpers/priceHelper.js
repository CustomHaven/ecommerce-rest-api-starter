const priceHelper = (obj, table1, table2, colname) => {
    const query = [`SELECT SUM(${table1}.${Object.keys(obj)[0]} * ${table2}.${colname})`];
    query.push(`FROM ${table2}`);
    query.push(`JOIN ${table1}`);
    query.push(`ON ${table1}.${Object.keys(obj)[1]} = ${table2}.${Object.keys(obj)[2]}`);
    query.push(`WHERE ${table1}.${Object.keys(obj)[3]} = $1`);
    // query.push(`AND ${table1}.${Object.keys(obj)[8]} < ${Object.values(obj)[6]}`);
    query.push(`AND ${table1}.${Object.keys(obj)[4]} < $2`);

    query.push(`AND ${table1}.${Object.keys(obj)[4]} > $3`);

    // query.push(`AND ${table1}.${Object.keys(obj)[8]} > ${Object.values(obj)[7]}`);

    return query.join(' ');
};

module.exports = priceHelper;

// const priceFinalObj = {
//     quantity: 20,
//     price: 20,
//     store_products_spid: 6,
//     spid: 6,
//     customers_cid: 3,
//     order_date: '2021-09-03 20:22:33',
//     upper: upperBound,
//     lower: lowerBound
// }


`SELECT SUM(order_list.quantity * store_products.price)
FROM order_list
JOIN store_products
ON  order_list.store_products_spid = store_products.spid
WHERE order_list.order_date = '2021-09-03 20:22:33'
AND order_list.customers_cid = 3)`