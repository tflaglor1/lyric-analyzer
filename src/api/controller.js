const { response } = require('express');
const pool = require('./db-connection');
const queries = require('./queries');

const test = (req, res) => {
    res.send('test');
}

const getAllSongs = (req, res) => {
    pool.query(queries.getAllSongs, (error, results) =>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

module.exports={
    test,
    getAllSongs
}