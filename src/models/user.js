const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        //required: true,
        lowercase: true,
        trim: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
        //required: true,
        lowercase: true,
        trim: true,
        minLength: 4,
        maxLength: 50,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid Gender"+ err.message)
            };
        },
        
    },
    emailId: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email" + value);
            };
        },
    },
    password: {
        type: String,
        minLength: 8,
        //required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong" + value);
            }
        }

    },
    age: {
        type: Number,
        min: 18,
    },
    photoUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",

    },
    skills: {
        type: [String],
        required: true,
        minLength: 2,
        maxLength: 8,
    },
    about: {
        type: String,
        maxLength: 500,
        default: "Hey there! I am using NerdHive",
    }
}, {timestamps: true});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "secret@key123&*", { expiresIn: "7d" });
    
    return token;
};

userSchema.methods.validatePassword = async function(passInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passInputByUser, passwordHash);
    return isPasswordValid;

};

module.exports = mongoose.model("User", userSchema);