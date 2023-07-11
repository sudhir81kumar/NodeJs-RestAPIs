const mssql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
    driver: process.env.SQL_DRIVER,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE_NAME,
    user: process.env.SQL_USER_NAME,
    password: process.env.SQL_PASSWORD,
    encrypt: false,
    enableArithAbort: false
}

module.exports = { mssql, config }