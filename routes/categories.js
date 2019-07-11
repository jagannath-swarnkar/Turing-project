module.exports = (categories,knex)=>{
     
    categories.get('/categories',(req,res)=>{
        knex.select('*').from('category')
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
            console.log(err)
        })
    })

    categories.get('/categories/:id',(req,res)=>{
        knex.select('*').from('category').where('category.category_id',req.params.id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
            console.log(err)
        })
    })

    categories.get('/categories/inProduct/:id',(req,res)=>{
        knex.select('category.category_id','category.department_id','category.name').from('category')
        .join('product_category','product_category.category_id','=','category.category_id',)
        .where('product_category.product_id','=',req.params.id)
        .then((data)=>{
            return res.send(data)
        })
        .catch((err)=>{
            return res.send(err)
            console.log(err)
        })
    })

    categories.get('/categories/inDepartment/:id',(req,res)=>{
        knex.select('*')
        .from('category').join('department','department.department_id','=','category.department_id').where('department.department_id',req.params.id)
        .then((data)=>{
            return res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            return res.send(err)
        })
    })

};