module.exports = (attributes,knex)=>{

    attributes.get('/attributes',(req,res)=>{
        knex.select('*').from('attribute')
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
        })
    })

    attributes.get('/attributes/:id',(req,res)=>{
        knex.select('*').from('attribute').where('attribute_id',req.params.id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
        })
    });

    attributes.get('/attributes/values/:id',(req,res)=>{
        knex.select('attribute_value.attribute_value_id','attribute_value.value').from('attribute_value')
        .join('attribute','attribute_value.attribute_id','=','attribute.attribute_id')
        .where('attribute.attribute_id','=',req.params.id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
        })
    })

    attributes.get('/attributes/inProduct/:id',(req,res)=>{
        knex.select('*').from('attribute_value')
        .join('attribute',function(){
            this.on('attribute_value.attribute_id','=','attribute.attribute_id')})
        .join('product_attribute',function(){
            this.on('product_attribute.attribute_value_id','=','attribute_value.attribute_value_id')})
        .where('product_attribute.product_id','=',req.params.id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
        })
    })

};