const createHelper = (col, tableName) => {
    const query = [`INSERT INTO ${tableName}`];
    query.push('(');
    const set = [];
    Object.keys(col).forEach((key) => set.push(key));
    query.push(set.join(', '));
    query.push(')');
    query.push(' VALUES(')
    const value = [];
    Object.values(col).forEach((val, i) => value.push(`$${i + 1}`))
    query.push(value.join(', '))
    query.push(')');
    query.push(' RETURNING *')
  
    // Return a complete query string
    return query.join('');
}

module.exports = createHelper;