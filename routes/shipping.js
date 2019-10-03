module.exports=(shipping,knex)=>{
    // getting all the shipping details from shipping table------------http://localhost:8080/shipping
    shipping.get('/shipping/regions',(req,res)=>{
        knex('shipping')
        .select('*')
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log('err in fetching shipping_regions from shipping table',err)
            res.status(404).send(err)
        })
    })

    // getting shipping detail using shipping_id------------------------http://localhost:8000/shipping/{shipping_id}
    shipping.get('/shipping/regions/:shipping_region_id',(req,res)=>{
        knex('shipping')
        .where('shipping.shipping_region_id',req.params.shipping_region_id)
        .select('*')
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log('err in fetching shipping_region detail from shipping table using shipping_-id',err)
            res.status(404).send(err)
        })
    })
}