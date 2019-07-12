module.exports = (products,knex)=>{
    // GETTING DATA IN PAGE WITH LIMIT----------------
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

    // GETTING DATA BY PRODUCT_NAME USING SIMPLE QUERY STRING---------------
    products.get('/products/search',(req,res)=>{
        var str = req.query.query_string;
        var limit = req.query.limit;
        var page = req.query.page;
        knex.select('*').from('product').where('name','like','%'+str+'%').limit(limit).offset(limit*(page-1))
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    //  GETTING PRODUCT BY PRODUCT ID-------------------
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

    // GETTING PRODUCT BY PRODUCT_CATEGORY ID-----------------------------
    products.get('/products/inCategory/:category_id',(req,res)=>{
        knex.select('*').from('product').join('product_category','product_category.product_id','=','product.product_id')
        .where('category_id',req.params.category_id)
        // .where('category_id',req.params.category_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    // GETTING PRODUCTS USIGN DEPARTMENT ID
    products.get('/products/inDepartment/:department_id',(req,res)=>{
        knex.select('*').from('product').join('product_category','product_category.product_id','=','product.product_id')
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

    //  GETTING PRODUCT DETAIL USING PRODUCT_ID
    products.get('/products/:product_id/details',(req,res)=>{
        knex.select('name','product_id','description','price','discounted_price','image','image_2').from('product').where('product_id',req.params.product_id)
        .then((data)=>{
            return res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    //   GETTING THE PRODUCT *LOCATIONS* USING PRODUCT ID
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

}