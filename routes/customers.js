module.exports = (customers,knex,jwt,SECRET,checkToken)=>{

    // Resistration of custmer --signup--------------------ex--localhost:8000/customers
    customers.post('/customers',(req,res)=>{
        knex('customer')
        .insert(req.body)
        .then((data)=>{
            knex.select('*')
            .from('customer')
            .where('customer.email',req.body.email)
            .then((result)=>{
                delete result[0].password;
                res.json(result)
            })
            .catch((err)=>{
                console.log('err in sending customer detail')
                res.json(err)
            })
        })
        .catch((err)=>{
            console.log('err in resistering coustomer detail')
            res.json(err)
        })
    })

    // Customers login  and creating jwt token and set into cookies-----------------------localhost:8000/customers/login
    customers.post('/customers/login',checkToken,(req,res)=>{
        knex('customer as c')
        .where('c.email',req.body.email)
        .andWhere('c.password',req.body.password)
        .then((data)=>{
            if(data.length>0){
                console.log({'email':data[0].email,'customer_id':data[0].customer_id})
                jwt.sign(
                    {
                        data:{'email':data[0].email,'customer_id':data[0].customer_id}
                    },
                    SECRET,
                    {
                        expiresIn:'1d'
                    },
                    (err,token)=>{
                    if(!err){
                        res.cookie('auth',token);
                        // sending back data into frontend again------
                            knex.select('*')
                            .from('customer')
                            .where('customer.email',req.body.email)
                            .then((result)=>{
                                delete result[0].password;
                                let data = {"customer":{"schema":result[0]}}
                                data["accessToken"]=req.token;
                                data['expiresIn']='1d';
                                res.json(data)
                            })
                            .catch((err)=>{
                                console.log('err in sending customer detail')
                                res.json(err)
                            })  

                    }else{console.log('err in creating jwt',err)}
                })

            }else{res.send('User not resistered')}
            
           
        })
        .catch((err)=>{
            console.log('err in login',err);
            res.json(err)
        })
    })

    // get Customer detail --------------------ex--localhost:8000/customer
    customers.get('/customer',checkToken,(req,res)=>{
        jwt.verify(req.token,SECRET,(err,data)=>{
            if(!err){
                console.log('token verified',data.data.email)
                knex('customer')
                .where('customer.email',data.data.email)
                .then((result)=>{
                    delete result[0].password;
                    res.json(result)
                })
                .catch((err)=>{
                    console.log('err in verifying user detail in db',err)
                    res.json(err)
                })
            }else{
                console.log('err in verifying token',err)
                res.send(err)
            }
        })
    })

    //put method to update customer detail----------------ex--
    customers.put('/customer',checkToken,(req,res)=>{
        jwt.verify(req.token,SECRET,(err,data)=>{
            if(!err){
                var email=data.data.email
                console.log(email,req.body)
                var rb = req.body
                knex('customer')
                .where('customer.email',email)
                .update(req.body)
                // .update({name:rb.name,email:rb.email,password:rb.password,day_phone:rb.day_phone,eve_phone:rb.eve_phone,mob_phone:rb.mob_phone})
                .then((data)=>{
                    console.log('customer detail updated successfuly',data)
                    knex('customer as c')
                    .where('c.email',email)
                    .then((result)=>{
                        delete result[0].password;
                        res.json(result);
                    })
                    .catch((err)=>{
                        console.log('err in getting updated customer detail from db',err);
                        res.json(err);
                    })
                })
                .catch((err)=>{
                    console.log('err in updating customer detail',err)
                    res.json(err)
                })
            }else{
                console.log('err in verifying token',err);
                res.json(err)
            }
        })
    })

    // updating customer address--------------------ex--
    customers.put('/customer/address',checkToken,(req,res)=>{
        jwt.verify(req.token,SECRET,(err,data)=>{
            if(!err){
                var email=data.data.email
                console.log(email,req.body)
                var rb = req.body
                knex('customer')
                .where('customer.email',email)
                // .update({address_1:rb.address_1,address_2:rb.address_2,city:rb.city,region:rb.region,postal_code:rb.postal_code,country:rb.country,shipping_region_id:rb.shipping_region_id})
                .update(req.body)
                .then((data)=>{
                    console.log('customer detail updated successfuly',data)
                    knex('customer as c')
                    .where('c.email',email)
                    .then((result)=>{
                        delete result[0].password;
                        res.json(result);
                    })
                    .catch((err)=>{
                        console.log('err in getting updated customer detail from db',err);
                        res.json(err);
                    })
                })
                .catch((err)=>{
                    console.log('err in updating customer detail',err)
                    res.json(err)
                })
            }else{
                console.log('err in verifying token',err);
                res.json(err)
            }
        })
    })

    // updating customer credit card
    customers.put('/customer/creditCard',checkToken,(req,res)=>{
        jwt.verify(req.token,SECRET,(err,data)=>{
            if(!err){
                var email=data.data.email
                console.log(email,req.body)
                var rb = req.body
                knex('customer')
                .where('customer.email',email)
                .update(req.body)
                .then((data)=>{
                    console.log('customer detail updated successfuly',data)
                    knex('customer as c')
                    .where('c.email',email)
                    .then((result)=>{
                        delete result[0].password;
                        res.json(result);
                    })
                    .catch((err)=>{
                        console.log('err in getting updated customer detail from db',err);
                        res.json(err);
                    })
                })
                .catch((err)=>{
                    console.log('err in updating customer detail',err)
                    res.json(err)
                })
            }else{
                console.log('err in verifying token',err);
                res.json(err)
            }
        })
    })

}