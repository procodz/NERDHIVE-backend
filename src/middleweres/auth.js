const jwt = require("jsonwebtoken");
const User  = require("../models/user")



const userAuth = async (req,res,next) =>{
    try{ 
        const { token } = req.cookies;
        if(!token){
            return res.status(401).send("please login");
        }
        const decodedUser = await jwt.verify(token, process.env.JWT_SECRET,);
        const { _id } = decodedUser;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("user does not exist");
        }
        req.user = user;// it will put user detail in request of user
        next();
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }

}

module.exports = {
    userAuth
}