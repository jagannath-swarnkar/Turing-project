const mysql = require('mysql');
const express = require('express');

let knex=require('knex')({
    client:'mysql',
    connection:{
    'host':'localhost',
    'user':'root',
    'password':'jagan@jagan',
    'database':'turingdb'
    }
});

const app = express();
app.use(express.json())

var departments = express.Router();
app.use('/',departments);
require('./routes/departments')(departments,knex);

var categories = express.Router();
app.use('/',categories);
require('./routes/categories')(categories,knex);

var attributes = express.Router();
app.use('/',attributes);
require('./routes/attributes')(attributes,knex);

var products = express.Router();
app.use('/',products);
require('./routes/products')(products,knex)

var server = app.listen(8000, ()=>{
    var port = server.address().port;
    console.log(`your port is listening on port ${port}`);
});
