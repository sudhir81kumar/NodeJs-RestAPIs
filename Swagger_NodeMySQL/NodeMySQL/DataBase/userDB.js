const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

var connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
  });
  
  module.exports = connection;