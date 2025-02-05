const socket = require("socket.io");
const Chat = require("../models/chatModel");

/**
 * Initialize WebSocket server with Socket.IO
 * @param {Object} server - HTTP/HTTPS server instance
 */
const initilaizeSocket = (server) => {
  // Configure Socket.IO with CORS settings for development
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend development server URL
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
    },
  });

  // Handle new client connections
  io.on("connection", (socket) => {
    /**
     * Handle chat room joining
     * Creates a unique room identifier for two users to chat
     * Room name is created by sorting and joining user IDs to ensure consistency
     */
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      try {
        // Create a unique room ID by sorting user IDs alphabetically and joining with underscore
        // This ensures the same room name regardless of who initiates the chat
        const room = [userId, targetUserId].sort().join("_");
        socket.join(room); // Add user to the chat room
        console.log(`${firstName} Joined room: ${room}`);
      } catch (error) {
        console.error("Error in joinChat:", error);
      }
    });

    /**
     * Handle sending messages between users
     * Broadcasts the message to all users in the specific chat room
     * @param {Object} messageData - Contains message details (firstName, userId, targetUserId, text)
     */
    socket.on("sendMessage", async (messageData) => {
      try {
        const { firstName, userId, targetUserId, text } = messageData;
        // Generate the same room ID using sorted user IDs
        const room = [userId, targetUserId].sort().join("_");

        console.log(`${firstName} Sent message to room: ${room}`);
        //save messages to database

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });
        if(!chat){
                chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
        }
        chat.messages.push({senderId: userId, text: text, time: new Date()});
        await chat.save();
        console.log("Message:", text);

        // Emit message to all users in the room
        // Include sender's ID (userId) so frontend can determine message alignment
        io.to(room).emit("messagereceived", {
          firstName,
          text,
          userId, // Important for frontend to identify message sender
        });
      } catch (error) {
        console.error("Error in sendMessage:", error);
      }
    });

    /**
     * Handle client disconnection
     * Logs when a user disconnects from the chat
     */
    socket.on("disconnect", () => {});
  });
};

module.exports = initilaizeSocket;
