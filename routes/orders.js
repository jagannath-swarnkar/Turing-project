module.exports=(orders,knex,jwt,SECRET,checkToken,uniqid)=>{

    // Post an Order ------------------
    orders.post('/orders',checkToken,(req,res)=>{
        jwt.verify(req.token,SECRET,(err,data)=>{
            if(!err){
                var data = data.data
                console.log(data,uniqid(data.customer_id))
                res.json(data)
            }else{
                console.log('err in verifying token',err)
                res.json(err)
            }
        })
    })
}