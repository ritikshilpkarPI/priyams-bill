const Staff = require("../db-models/staff-model");

const isAdmin = async (req,res,next)=>{
     try{
        const {username} = req.body;
        const user = await Staff.findOne({username});
        if(user && user.role === "admin"){
            next();
        }else{
            res.status(400).send({message:"you are not authorized",success:false});
        }
     }catch(err){
        res.status(400).send({message:err.message,success:false});
     }
}
module.exports = {
    isAdmin
}