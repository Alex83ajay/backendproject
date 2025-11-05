module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
        
   if(process.env.NODE_ENV=="development"){
     res.status(err.statusCode).json({
        success:false,
        message:err.message,
        stack:err.stack,
        error:err
    })

   }

     if(process.env.NODE_ENV=="production"){   //please  enter a production matum tha response kamikanum user ku prduction la
     let message=err.message;
     let error=new Error(message)
     if(err.name=="validationError"){
        message=Object.values(err.errors).map(value=>value.message)
        error=new Error(message)
 }
    if(err.name=='castError'){
        message=`Resource not found:${err.path}`
         error=new Error(message)

    }


        res.status(err.statusCode).json({
        success:false,
        message:err.message ||'internal server Error',

    })

   }

}