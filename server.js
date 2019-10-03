const express = require('express');
const {DB_HOST,DB_USER,DB_PASS,DB_NAME,SECRET} = require('./config').envdata;
const jwt  = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const checkToken = require('./TokenVerify/TokenVerify');
var uniqid = require('uniqid');
var _ = require('underscore');

let knex=require('knex')({
    client:'mysql',
    connection:{
    'host':DB_HOST,
    'user':DB_USER,
    'password':DB_PASS,
    'database':DB_NAME
    },useNullAsDefault:true
});

const app = express();
app.use(express.json())
app.use(cookieParser())


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
require('./routes/products')(products,knex,jwt,SECRET,checkToken);

var customers =express.Router();
app.use('/',customers);
require('./routes/customers')(customers,knex,jwt,SECRET,checkToken);

var orders = express.Router();
app.use('/',orders);
require('./routes/orders')(orders,knex,jwt,SECRET,checkToken,_);

var shoppingcart = express.Router();
app.use('/',shoppingcart);
require('./routes/shoppingcart')(shoppingcart,knex,jwt,SECRET,checkToken,uniqid,_);

var tax = express.Router();
app.use('/',tax);
require('./routes/tax')(tax,knex)

var shipping = express.Router();
app.use('/',shipping);
require('./routes/shipping')(shipping,knex)



var server = app.listen(8000, ()=>{
    var port = server.address().port;
    console.log(`your port is listening on port ${port}`);
});
