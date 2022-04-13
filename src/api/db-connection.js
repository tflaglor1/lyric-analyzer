const {Pool} = require('pg');
require('dotenv').config({path: __dirname + '/../../.env'});


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "lyricanalyzer",
    password: process.env.DB_PASS,
    port: 5437
});

pool.on('connect', (client) =>{
    client.query('SET search_path to lyricanalyer, public')
});

module.exports = pool;