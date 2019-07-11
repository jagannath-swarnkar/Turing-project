module.exports = (departments,knex) =>{

    departments.get('/departments',(req,res)=>{
        knex.select('*').from('department')
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.send(err)
            console.log(err)
        })
    });

    departments.get('/departments/:Id',(req,res)=>{
        knex.select('*').from('department').where('department.department_id',req.params.Id)
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.send(err)
            console.log(err)
        })
    });

};