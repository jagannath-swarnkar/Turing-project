// const express = require('express');
// var router = express.Router()

let knex=require('knex')({
    client:'mysql',
    connection:{
    'host':'localhost',
    'user':'root',
    'password':'jagan@jagan',
    'database':'turingdb'
    }
});