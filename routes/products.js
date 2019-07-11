module.exports = (products,knex)=>{
    products.get('/products',(req,res)=>{
        knex.select('*').from('department')
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.send(err)
            console.log(err)
        })
    });
}