module.exports = (products,knex,jwt,SECRET,checkToken)=>{
    // GETTING DATA IN PAGE WITH LIMIT----------------ex--localhost:8000/products
    products.get('/products',(req,res)=>{
        var limit = req.query.limit;
        var page = req.query.page;
        knex.select('*').from('product').limit(limit).offset(limit*(page-1))
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    });

    // GETTING DATA BY PRODUCT_NAME USING SIMPLE QUERY STRING-------------ex--localhost:8000/products/search?query_string=coat
    products.get('/products/search',(req,res)=>{
        var str = req.query.query_string;
        var limit = req.query.limit;
        var page = req.query.page;
        knex('product as p').select('p.product_id','p.name','p.description','p.price','p.discounted_price','p.thumbnail')
        .where('name','like','%'+str+'%')
        .limit(limit)
        .offset(limit*(page-1))
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    //  GETTING PRODUCT BY PRODUCT ID-------------------ex--products/1
    products.get('/products/:product_id',(req,res)=>{
        knex.select('*').from('product').where('product_id',req.params.product_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    // GETTING PRODUCT BY PRODUCT_CATEGORY ID-----------------------------ex--products/inCategory/1
    products.get('/products/inCategory/:category_id',(req,res)=>{
        knex('product as p').select('p.product_id','p.name','p.description','p.price','p.discounted_price','p.thumbnail')
        .join('product_category','product_category.product_id','=','p.product_id')
        .where('category_id',req.params.category_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    // GETTING PRODUCTS USIGN DEPARTMENT ID---------------------------ex---prroducts/inDepartment/1
    products.get('/products/inDepartment/:department_id',(req,res)=>{
        knex('product as p').select('p.product_id','p.name','p.description','p.price','p.discounted_price','p.thumbnail')
        .join('product_category','product_category.product_id','=','p.product_id')
        .join('category','category.category_id','=','product_category.category_id')
        .where('department_id',req.params.department_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    //  GETTING PRODUCT DETAIL USING PRODUCT_ID--------------------------ex---product/1/details
    products.get('/products/:product_id/details',(req,res)=>{
        knex('product as p').select('p.product_id','p.name','p.description','p.price','p.discounted_price','p.image','p.image_2')
        .where('product_id',req.params.product_id)
        .then((data)=>{
            return res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    //   GETTING THE PRODUCT *LOCATIONS* USING PRODUCT ID-----------------ex---product/1/locations
    products.get('/products/:product_id/locations',(req,res)=>{
        knex.select('category.category_id','category.name AS category_name','department.department_id','department.name AS department_name')
        .from('department')
        .join('category','category.department_id','=','department.department_id')
        .join('product_category','product_category.category_id','=','category.category_id')
        .where('product_id',req.params.product_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    // uploading reviews and ratings --------------
    products.post('/products/:product_id/reviews',checkToken,(req,res)=>{
        jwt.verify(req.token,SECRET,(err,tokenData)=>{
            if(!err){
                knex('review')
                .insert({
                    customer_id:tokenData.data.customer_id,
                    product_id:req.params.product_id,
                    review:req.body.review,
                    rating:req.body.rating,
                    created_on:new Date()
                })
                .then((data)=>{
                    knex('review')
                    .select('*')
                    .where('review.product_id',req.params.product_id)
                    .then((result)=>{
                        res.json(result)
                    })
                    .catch(err => res.json(err))
                })
                .catch((err)=>{
                    console.log('err in inserting review',err)
                    res.json(err)
                })
            }else{
                res.json({status:"invalid token","message":"err in verifying token"})
            }
        })
        
    })

    // getting reviews of a product using product_id--------------------
    products.get('/products/:product_id/reviews',(req,res)=>{
        knex('review')
        .select('*')
        .where('review.product_id',req.params.product_id)
        .then((result)=>{
            res.json(result)
        })
        .catch(err => res.json(err))
    })

}