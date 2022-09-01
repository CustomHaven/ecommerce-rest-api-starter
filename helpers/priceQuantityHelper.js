const totalPriceQuantity = (table1, table2, table1Id, table2Id, table3Col, price, quantity) => {
    const query = [`SELECT `];
    query.push(`SUM(${table1}.${price} * ${table2}.${quantity}) AS final_price, `);
    query.push(`SUM(${table2}.${quantity}) as total_items `);
    query.push(`FROM ${table1} `);
    query.push(`JOIN ${table2} `)
    query.push(`ON ${table1}.${table1Id} = ${table2}.${table2Id} `);
    query.push(`WHERE ${table2}.${table3Col} = $1;`);

    return query.join("");
}

module.exports = totalPriceQuantity;