module.exports=(tax,knex)=>{
    // getting all the tax details from tax table------------http://localhost:8080/tax
    tax.get('/tax',(req,res)=>{
        knex('tax')
        .select('*')
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log('err in fetching data from tax table',err)
            res.status(404).send(err)
        })
    })

    // getting tax detail using tax_id------------------------http://localhost:8000/tax/{tax_id}
    tax.get('/tax/:tax_id',(req,res)=>{
        knex('tax')
        .where('tax.tax_id',req.params.tax_id)
        .select('*')
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log('err in fetching tax detail from tax table using tax_-id',err)
            res.status(404).send(err)
        })
    })
}