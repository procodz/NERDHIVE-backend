const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateEmailId, validatePassword } = require("../utils/validate");


const authRouter = express.Router();

//signup API
authRouter.post("/signup", async (req,res) => {
    
    
    try {
        const {firstName, lastName, emailId, password, skills} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const user = new User(
            {firstName,
            lastName,
            emailId,
            password: passwordHash,
            skills
        }
        );
        await user.save();
        res.send("user added successfully....");
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});


//Login API
authRouter.post("/login", async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        validateEmailId(emailId); //first validating email
        const user = await User.findOne({emailId: emailId}); // cheching if this email is there in DB
        if(!user){
            throw new Error("invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);//comparing entered pass and user hashPass //this fn returns a boolean
        // const isPasswordValid = await user.password;
        if(isPasswordValid){
            //genrating jwt token
            // const token = await jwt.sign({_id: user._id}, "secret@key123&*", { expiresIn: "7d" });
            // res.cookie("token", token);//it will send the cookie to user with name token
            const token = await user.getJWT();
            res.cookie("token", token);
            res.json({message: "login successful",
                data: user
            });//if true login 
        }else{
            throw new Error("ivalid credintials");
        }
    }
    catch(err){
        res.status(404).send("ERROR" + err.message);
    }
});



module.exports = authRouter;