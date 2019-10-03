module.exports=(orders,knex,jwt,SECRET,checkToken,_)=>{
    // Post an Order ------------------
    orders.post('/orders',checkToken,(req,res)=>{
        jwt.verify(req.token,SECRET,(err,tokenData)=>{
            if(!err){
                knex('shopping_cart')
                .where('shopping_cart.cart_id',req.body.cart_id)
                .then((data)=>{
                    if(data.length>0){
                        knex('product as p')
                        .select(
                            'p.name',
                            'sc.attributes',
                            'sc.product_id',
                            'p.price',
                            'sc.quantity'
                        )
                        .join(
                            'shopping_cart as sc',
                            'sc.product_id','=',
                            'p.product_id'
                        )
                        .where('sc.cart_id',req.body.cart_id)
                        .then((data2)=>{
                            // creating subtotal key-----and creating Total Amount
                            var mainData = data2.filter((i)=>{
                                return(i['subtotal']=i.price*i.quantity)
                            })
                            var totalAmount = _.reduce(mainData, (memo, num) => { return memo + num.subtotal; }, 0)  
                            // creating order details to store in order table-------------
                            var orderDetails = {
                                            "total_amount": totalAmount,
                                            "created_on": new Date(),
                                            "customer_id":tokenData.data.customer_id,
                                            "shipping_id": req.body.shipping_id,
                                            "tax_id": req.body.tax_id
                                            }
                            knex('orders')
                            .insert(orderDetails)
                            .then((data3)=>{
                                // creating order_detail data to store in order_detail table and finally will return order id----------
                                var order_detail_data={
                                                    "order_id": data3[0],
                                                    "product_id": mainData[0].product_id,
                                                    "attributes": mainData[0].attributes,
                                                    "product_name": mainData[0].name,
                                                    "quantity": mainData[0].quantity,
                                                    "unit_cost": mainData[0].price
                                                    }
                                knex('order_detail')
                                .insert(order_detail_data)
                                .then((data4)=>{
                                    res.json([{order_id:order_detail_data.order_id}])
                                })
                                .catch((err)=>{
                                    console.log('err in inserting order_detail_data into order detail table',err)
                                    res.json(err)
                                })
                            })
                            .catch((err)=>{
                                console.log('err in inserting order detail into order table',err)
                                res.json(err)
                            })

                        })
                        .catch((err)=>{
                            console.log('err in joining product and sc table',err)
                            res.json(err)
                        })
                    }else{
                        res.json({status:"Not Okay","message":"cart is empty"})
                    }
                })
                .catch((err)=>{
                    console.log('err in fetching data from shopping cart usinng cart_id',err)
                    res.status(404).send(err)
                })
            }else{
                console.log("err in verifying token ",err)
                res.json({status:"Not Okey","message":"err in verifying token"})
            }
        })
    })

    // getting order data using order_id---------------------
    orders.get('/orders/:order_id',checkToken,(req,res)=>{
        jwt.verify(req.token,SECRET,(err,tokenData)=>{
            if(!err){
                knex('order_detail')
                .where('order_detail.order_id',req.params.order_id)
                .then((data)=>{
                    var mainData = data.filter((i)=>{
                        return(i['subtotal']=i.unit_cost*i.quantity)
                    })
                    res.json(mainData)
                })
                .catch(err=>res.json(err))
            }else{
                res.json({status:"token err","message":"err in verifying token"})
            }
        })
    })

    // getting orders by customer-------------
    orders.get('/orders/inCustomer/data',checkToken,(req,res)=>{
            jwt.verify(req.token,SECRET,(err,tokenData)=>{
            if(!err){
                knex('orders')
                .select(
                    'order_id',
                    'total_amount',
                    'created_on',
                    'shipped_on',
                    'status',
                    'name'
                )
                .join(
                    'customer',
                    'customer.customer_id','=',
                    'orders.customer_id'
                    )
                .where('customer.customer_id',tokenData.data.customer_id)
                .then((data) => {
                    res.json(data)
                })
                .catch(err => {
                    res.json(err)
                })
            }else{
                console.log('err in verifying token',err)
                res.json(err)
            }
        })
    })

    // short detail of customer 
    orders.get('/orders/shortDetail/:order_id',checkToken, (req,res) => {
        jwt.verify(req.token,SECRET,(err,tokenData)=>{
            if(!err){
                knex('orders')
                .select(
                    'order_id',
                    'total_amount',
                    'created_on',
                    'shipped_on',
                    'status',
                    'name'
                )
                .join('customer','customer.customer_id','=','orders.customer_id')
                .where('orders.order_id',req.params.order_id)
                .then(data => {
                    res.json(data)
                })
                .catch(err => {
                    res.json(err)
                })
            }
        })
    })

}    
