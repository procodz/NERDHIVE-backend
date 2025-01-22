const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://techbite88:gyzkCSypX7s4xF2Y@nodecourse.7lthm.mongodb.net/devTinder");
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
