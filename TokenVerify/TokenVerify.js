module.exports=(req,res,next)=>{
    var token=req.headers.cookie || req.body.token;
    if(token.startsWith('auth=')){
        var Token=token.slice(5)
        // console.log(Token)
        req.token=Token
        next()
    }else{
        console.log('err in getting token in VerifyToken.js')
    }
}