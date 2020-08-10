//const sql = require("mssql");
const sql= require("mssql/msnodesqlv8")

//config for your database
const config = {
    user: process.env.user,
    password: process.env.password,
    driver: 'msnodesqlv8',
    server: 'localhost',
    database: 'Covid',
    options: { "enableArithAbort": true,trustedConnection:true }
};

const poolPromise =new sql.ConnectionPool(config)
    .connect()
    .then(pool=>{
        console.log('Connected to DB')
        return pool
    })
    .catch(error=>console.log('Database Connection failed'))


module.exports= {config,sql,poolPromise}