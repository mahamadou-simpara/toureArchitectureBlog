const database = require('mysql2/promise');

const db = database.createPool({
    host: 'localhost',
    user: 'root',
    database: 'architect',
    password: 'mysqltest'
})

module.exports = db;

