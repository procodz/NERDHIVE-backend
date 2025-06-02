const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middleweres/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const user = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl about skills";

//making received requests to a user

requestRouter.get("/user/request/received", userAuth, async(req,res) => {
    try {
        
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,   //making sure touserId is loggedInUser
            status: "interested", //loggedInUser can only see the request which are interested in him
        }).populate("fromUserId", "firstName lastName photoUrl"); // populate method is to finding from reference DB which is User in this case 

        res.json({
            messgae: "List of received requests",
            data: connectionRequest,
        })

    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }
});

requestRouter.get("/user/connections", userAuth, async (req,res) =>{
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find(
           {$or: [
           { 
            toUserId: loggedInUser._id,
            status: "accepted",
           },
           {
            fromUserId: loggedInUser._id,
            status: "accepted",
        }
        ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
        const data = await connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({message: "all the connections",
            data,
        });

        
    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }
});

requestRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 3;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        // Aggregation pipeline to get all userIds to exclude (already connected or requested)
        const connectionRequests = await ConnectionRequest.aggregate([
            {
                $match: {
                    $or: [
                        { fromUserId: loggedInUser._id },
                        { toUserId: loggedInUser._id }
                    ]
                }
            },
            {
                $project: {
                    userIds: ["$fromUserId", "$toUserId"]
                }
            },
            { $unwind: "$userIds" },
            {
                $group: {
                    _id: null,
                    allUserIds: { $addToSet: "$userIds" }
                }
            }
        ]);

        // Prepare set of userIds to exclude
        let hideFromFeed = connectionRequests.length > 0 ? connectionRequests[0].allUserIds : [];
        // Also exclude the logged-in user
        hideFromFeed.push(loggedInUser._id);

        // Aggregation pipeline for paginated user feed
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $nin: hideFromFeed }
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    photoUrl: 1,
                    about: 1,
                    skills: 1
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);

        res.json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});




module.exports = requestRouter;