const threeTableHelper = (col, table) => {
    const query = [`SELECT ${Object.keys(table)[0]}.${Object.keys(col)[3]},`];
    query.push(`SUM(${Object.keys(table)[0]}.${Object.keys(col)[4]} * ${Object.keys(table)[1]}.${Object.values(col)[4]})`)
    query.push(`FROM ${Object.keys(table)[0]}`);
    query.push(`JOIN ${Object.keys(table)[1]}`);
    query.push(`ON ${Object.keys(table)[1]}.${Object.keys(col)[5]} = ${Object.keys(table)[0]}.${Object.values(col)[5]}`);
    query.push(`JOIN ${Object.keys(table)[2]}`);
    query.push(`ON ${Object.keys(table)[1]}.${Object.keys(col)[0]} = ${Object.keys(table)[2]}.${Object.values(col)[3]}`);
    query.push(`WHERE ${Object.keys(table)[1]}.${Object.keys(col)[0]} = $1`);
    // query.push(`AND ${table1}.${Object.keys(obj)[8]} < ${Object.values(obj)[6]}`);
    query.push(`AND ${Object.keys(table)[1]}.${Object.keys(col)[1]} < $2`);

    query.push(`AND ${Object.keys(table)[1]}.${Object.keys(col)[1]} > $3`);
    query.push(`GROUP BY ${Object.keys(table)[0]}.${Object.keys(col)[3]}`);
    query.push(`ORDER BY $4 ASC`);
    // query.push(`AND ${table1}.${Object.keys(obj)[8]} > ${Object.values(obj)[7]}`);

    return query.join(' ');
};

module.exports = threeTableHelper;