const express = require("express");
const { userAuth } = require("../middleweres/auth");
const Chat = require("../models/chatModel");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const userId = req.user._id;
    const {targetUserId} = req.params;
    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        })

        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }
        // console.log("Found chat:", JSON.stringify(chat, null, 2));
        // console.log("Raw chat from DB:", JSON.stringify(chat, null, 2));
        res.json(chat);
        
    } catch (error) {
        res.status(400).send("Error : " + error.message);
        
    }
});

module.exports = chatRouter;
