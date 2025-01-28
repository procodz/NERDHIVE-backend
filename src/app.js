require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,//even if i am sending http instead https request it will accept it
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const projectRouter = require("./routes/projects");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/",projectRouter);










connectDB().then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT,() => {
        console.log("Listening server 3000.....");
    })
}).catch((err) =>{
    console.error("DB could not connect...");
});
