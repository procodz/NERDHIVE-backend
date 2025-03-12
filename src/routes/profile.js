const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleweres/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

//Profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      message: "this your profile",
      user,
    });
  } catch (err) {
    res.status(404).send("ERROR" + err.message);
  }
});

//view some other user's profile
profileRouter.get("/profile/view/:userId", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "firstName lastName photoUrl about"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    };
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  });

//delete a user from DB
profileRouter.delete("/user/deleteUser", userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findOneAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(404).send("ERROR " + err.message);
  }
});

//Update the data in DB
profileRouter.patch("/user/edit", userAuth, async (req, res) => {
  const data = req.body;

  try {
    const Allowed_Update = [
      "firstName",
      "age",
      "gender",
      "skills",
      "photoUrl",
      "lastName",
      "about",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Update.includes(k)
    ); // loop through all the data(req.body) and checks if allowed field includes data(req.body)
    if (!isUpdateAllowed) {
      throw new Error("Invalid Update...");
    }

    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    await updatedUser.save();
    res.json({
      message: "user data updated successfully...",
      data: updatedUser,
    });
  } catch (err) {
    res.status(404).send("ERROR " + err.message);
  }
});

profileRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      //setting token value to null this will delete the cookie and u will be logged out.
      expires: new Date(Date.now()),
    })
    .send("you have been loged out successfully!");
});

profileRouter.patch("/forgetPassword", userAuth, async (req, res) => {
  try {
    const user = req.user; //getting user from req
    const currentPass = req.body.currentPass; //input by user
    const newPassword = req.body.newPassword; //input by user
    const checkingPass = await bcrypt.compare(currentPass, user.password); //checking if currentpass is the user pass
    const isStrongPass = validator.isStrongPassword(newPassword);
    if (!isStrongPass) {
      throw new Error("please input strong password");
    }
    if (!checkingPass) {
      throw new Error("Invalid credentials...");
    }
    user.password = await bcrypt.hash(newPassword, 10); //changing current pass to newpass
    await user.save(); //saving the data
    res.send("password is succesfully updated.");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// View specific user's profile
profileRouter.get("/profile/view/:userId", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('firstName lastName photoUrl about');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = profileRouter;
