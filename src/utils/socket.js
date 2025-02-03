const socket = require("socket.io");

const initilaizeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
        },
    });

    io.on("connection", (socket) =>{
        //handle events
        socket.on("joinChat",() =>{
            console.log("User Joined Chat");
        });

        socket.on("sendMessage", () =>{
            console.log("Message: ");
        });

        socket.on("disconnect", () =>{
            console.log("User Disconnected");
        });
    });
};


module.exports = initilaizeSocket;