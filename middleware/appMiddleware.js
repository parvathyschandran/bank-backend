//define application specefic middleware

const appMiddleware=(req,res,next)=>{
    console.log("application specefic middleware");
    next()
}

module.exports ={
    appMiddleware
}