const updateHelper = (col, tableName, idName) => {
    const query = [`UPDATE ${tableName}`];
    query.push('SET');

    const set = [];
    Object.keys(col).forEach((key, i) => set.push(key + ' = $' + (++i + 1)));
    query.push(set.join(', '));

    query.push(`WHERE ${idName} = $1`);
    query.push('RETURNING *');
  
    // Return a complete query string
    return query.join(' ');
}

module.exports = updateHelper;