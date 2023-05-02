const jwt =require("jsonwebtoken")
const SECRET_KEY="PRODUCTAPI"
const logger=require('./logger')

const auth=(req,res,next)=>{
    try{
        let token =req.headers.authorization
        if(token){
            token=token.split(" ")[1]
            let user=jwt.verify(token,SECRET_KEY)
            req.id=user.id
        }
        else{
            res.status(401).json({message:"Unauthorized User"})
            logger.info("unauthorized access")
        }
        next()
    }catch (error){
        console.log(error)
        res.status(401).json({message:"something went wrong"})
        logger.error(error.message)
    }
}
module.exports=auth