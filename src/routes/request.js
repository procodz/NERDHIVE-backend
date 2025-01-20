const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleweres/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

//sendConnectionReq
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) =>{
    try {const userId = req.user._id;
    const fromUserId = userId;
    const toUserId = req.params.toUserId
    const toUserIdObj = await User.findById(toUserId);
    const toUserIdFirstName = toUserIdObj.firstName;
    const status = req.params.status;
    

    const allowedStatus = ["interested","ignored"];
    
    if(fromUserId == toUserId){  //if user is making request to self....
        throw new Error("Bad request...")
    }
    if(!allowedStatus.includes(status)){
        throw new Error("Bad request!");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({  // it is checking if the req is alrady sent from both user 
        $or: [
            {fromUserId: fromUserId,toUserId: toUserId},
            {fromUserId: toUserId, toUserId: fromUserId},

        ],
    });
    const validUserId = await User.findById({_id: toUserId});// checking if the user is requesting to valid user which is present in our User DB otherwise user can send request to random id which is enot present in our User DB
    if(!validUserId){
        throw new Error('invalid user id...')
    };
    if(existingConnectionRequest){
        throw new Error("duplicate request...")
    }
    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    }); 

    const data = await connectionRequest.save();
    res.json({
        message: req.user.firstName + " " + "has" + " " +status + " " + toUserIdFirstName,
        data,
    });




}catch(err){
    res.status(404).send("Error:" + err.message);
}
});

//accepting or rejecting the request API

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res) => {
    try {
    const loggedInUser = req.user;
    const {status, requestId} = req.params;
    const allowedStatus = ["accepted", "rejected"];

    if(!allowedStatus.includes(status)){
        return res.status(404).json({message: "Invalid review status"});
    };
    const connectionRequest = await ConnectionRequest.findOne({  //finding document in DB where id is RequestId and status is ineterested and toUserId is loggedInUser bcs only user who have received the req can accept or reject it
        _id: requestId, 
        status: "interested",
        toUserId: loggedInUser._id,
    });
    if(!connectionRequest){
        return res.status(404).json({message: "Bad request.."});
    };
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({
        message: "request is"+ " " + status,
        data,
    })}catch(err){
        res.status(404).send("ERROR: " + err.message);
    };
});

module.exports = requestRouter;
