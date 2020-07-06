const sql = require("mssql");

//config for your database
const config = {
    user: process.env.user,
    password: process.env.password,
    server: 'localhost',
    database: process.env.databaseName,
    options: { "enableArithAbort": true }
};


module.exports= config