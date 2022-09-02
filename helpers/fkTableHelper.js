const fkTableHelper = (col, PKTable, FKTable, FKColName) => {
    const query = ["SELECT"];
    query.push(' ');
    const set = [];
    Object.keys(col).forEach((key) => set.push(`${PKTable}.${key}`));
    query.push(set.join(', '));
    query.push(` FROM ${PKTable}`);
    query.push(` JOIN ${FKTable}`);
    query.push(` ON ${PKTable}.${FKColName} = ${FKTable}.${Object.keys(col)[0]}`)
    
    query.push(` WHERE ${FKTable}.${Object.keys(col)[0]} = $1;`);

    // Return a complete query string
    return query.join('');
};

`
SELECT pi.id, pi.product_id, pi.image_name, pi.image_data, pi.created, pi.modified
FROM product_images AS pi
JOIN products as p
ON pi.product_id = p.id
WHERE p.id = 'prod 2';
`

module.exports = fkTableHelper;