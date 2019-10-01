module.exports=(shoppingcart,knex,jwt,SECRET,checkToken,uniqid)=>{

    // generating a shopping cart id----------------
    shoppingcart.get('/shoppingcart/generateUniqueId',checkToken,(req,res)=>{
        jwt.verify(req.token,SECRET,(err,data1)=>{
            if(!err){
                // checking for absence/presence of cart ID----------------------ex--localhost:8000/shoppingcart/generateUniqueId
                knex('shopping_cart')
                .select('cart_id')
                .then((data)=>{
                    if(data.length>0){
                        console.log('cart is already exists')

                            // getting cart id from shopping cart----
                                knex('shopping_cart')
                                .select('cart_id')
                                .where(('cart_id'[0]),data1.data.customer_id)
                                .then((data2)=>{
                                    console.log('jagan',data2)
                                    var result={"cart_id":data2}
                                    res.json(result)
                                })
                                .catch((err)=>{
                                    console.log('err in verifying cart_id from database')
                                })
                                    
                    }else{
                        var cartId = uniqid(data1.data.customer_id)
                        var result={"cart_id":cartId}
                        res.json(result)
                    }
                })
                .catch((err)=>{
                    res.json(err)
                })
            }else{
                console.log('err in verifying token',err)
                res.json(err)
            }
        })
    })

    // add a Product in shopping cart---------------ex---localhost:8000/shoppingcart/add
    shoppingcart.post('/shoppingcart/add',(req,res)=>{
        req.body.quantity=1
        req.body.added_on=new Date();
        knex('shopping_cart')
        .select('cart_id')
        .where('shopping_cart.cart_id',req.body.cart_id)
        .then((data)=>{
            if(data.length>0){
                knex('shopping_cart')
                .where('shopping_cart.cart_id',req.body.cart_id)
                .then((result)=>{
                    var flag=true;
                    for (var r of result){
                        if(
                            r.cart_id == req.body.cart_id &&
                            r.attributes == req.body.attributes &&
                            r.product_id == req.body.product_id
                            ){
                                flag=false
                                knex('shopping_cart')
                                .where('shopping_cart.cart_id',r.cart_id)
                                .andWhere('shopping_cart.attributes',r.attributes)
                                .andWhere('shopping_cart.product_id',r.product_id)
                                .update({quantity:r.quantity+1})
                                .then((result2)=>{
                                    console.log('same product posted',result2,flag)
                                        knex('shopping_cart as s')
                                        .select(
                                            's.item_id',
                                            'p.name',
                                            's.attributes',
                                            's.product_id',
                                            'p.image',
                                            'p.price',
                                            's.quantity'
                                            )
                                        .where('s.cart_id',req.body.cart_id)
                                        .join('product as p','p.product_id','=','s.product_id')
                                        .then((result3)=>{
                                            var rest=result3.filter((i)=>{
                                                return(i['subtotal']=i.price*i.quantity)
                                            })
                                            console.log('data get from shopping cart after update',rest)
                                            res.json(rest)
                                        })
                                        .catch((err)=>{
                                            console.log('err in getting data from shopping cart after updating',err)
                                            res.json(err)
                                        })
                                })
                            }
                        }
                        if(flag===true){
                            console.log(flag)
                            knex('shopping_cart')
                            .where('shopping_cart.cart_id',req.body.cart_id)
                            .insert(req.body)
                            .then((data)=>{
                                console.log('data updated into shopping cart')
                                knex('shopping_cart as s')
                                .select(
                                    's.item_id',
                                    'p.name',
                                    's.attributes',
                                    's.product_id',
                                    'p.image',
                                    'p.price',
                                    's.quantity'
                                    )
                                .where('s.cart_id',req.body.cart_id)
                                .join('product as p','p.product_id','=','s.product_id')
                                .then((result4)=>{
                                    // console.log('result4',result4)
                                    var rest=result4.filter((i)=>{
                                        return(i['subtotal']=i.price*i.quantity)
                                    })
                                    console.log('data get from shopping cart after update',rest,result4)
                                    res.json(rest)
                                })
                                .catch((err)=>{
                                    console.log('err in getting data from shopping cart after updating',err)
                                    res.json(err)
                                })
                            })
                            .catch((err)=>{
                                console.log('err in adding data to shopping cart',err)
                                res.json(err)
                            })
                        }
                        
                        
                    })
                    .catch((err)=>{
                        console.log('err in getting data from shopping cart after updating',err)
                        res.json(err)
                    })
            }else{
                knex('shopping_cart')
                .insert(req.body)
                .then((data)=>{
                    console.log('data updated into shopping cart')
                    knex('shopping_cart as s')
                    .select(
                        's.item_id',
                        'p.name',
                        's.attributes',
                        's.product_id',
                        'p.image',
                        'p.price',
                        's.quantity'
                        )
                    .where('s.cart_id',req.body.cart_id)
                    .join('product as p','p.product_id','=','s.product_id')
                    .then((result)=>{
                        console.log('result',result)
                        var rest2=result.filter((i)=>{
                            return(i['subtotal']=i.price*i.quantity)
                        })
                        console.log('data get from shopping cart after update rest2',rest2)
                        res.json(rest2)
                    })
                    .catch((err)=>{
                        console.log('err in getting data from shopping cart after updating',err)
                        res.json(err)
                    })
                })
                .catch((err)=>{
                    console.log('err in inserting data into shopping cart while posting ',err)
                    res.json(err)
                })
            }
        })
        .catch((err)=>{
            res.json(err)
        })
    })

    // Get list of products in shopping cart using cart_id------------------ex--localhost:8000/shoppingcart/{cart_id}
    shoppingcart.get('/shoppingcart/:cart_id',(req,res)=>{
        knex('shopping_cart as s')
        .select(
            's.item_id',
            'p.name',
            's.attributes',
            's.product_id',
            'p.image',
            'p.price',
            's.quantity'
            )
        .where('s.cart_id',req.params.cart_id)
        .join('product as p','p.product_id','=','s.product_id')
        .then((result)=>{
            var rest2=result.filter((i)=>{
                return(i['subtotal']=i.price*i.quantity)
            })
            res.json(rest2)
        })
        .catch((err)=>{
            console.log('err in fetching data from shoppingcart using cart_id',err)
        })
    })

    // Updating item Quantity by item_id--------------------ex---localhost:8000/shoppingcart/update/{item_id}
    shoppingcart.put('/shoppingcart/update/:item_id',(req,res)=>{
        knex('shopping_cart')
        .where('shopping_cart.item_id',req.params.item_id)
        .update({quantity:req.body.quantity})
        .then((data)=>{
            console.log('quantity updated of item_id',data)
            knex('shopping_cart as s')
            .select(
                's.item_id',
                'p.name',
                's.attributes',
                's.product_id',
                'p.image',
                'p.price',
                's.quantity'
                )
            .where('s.item_id',req.params.item_id)
            .join('product as p','p.product_id','=','s.product_id')
            .then((result)=>{
                var rest2=result.filter((i)=>{
                    return(i['subtotal']=i.price*i.quantity)
                })
                res.json(rest2)
            })
            .catch((err)=>{
                console.log('err in fetching data from shopping_cart',err)
                res.json(err)
            })
        })
        .catch((err)=>{
            console.log('err in updating quantity',err)
            res.json(err)
        })
    })

    // Deleting cart items usign cart_id---------------------------ex--localhost:8000/shoppingcart/delete/{cart_id}
    shoppingcart.delete('/shoppingcart/delete/:cart_id',(req,res)=>{
        knex('shopping_cart')
        .where('shopping_cart.cart_id',req.params.cart_id)
        .del()
        .then((data)=>{
            console.log('all items has deleted of your cart',data)
            knex('shopping_cart')
            .select('*')
            .where('shopping_cart.cart_id',req.params.cart_id)
            .then((result)=>{
                res.json(result)
            })
        })
        .catch((err)=>{
            console.log('err in deleting all the items of that cart',err)
        })
    })

    
}