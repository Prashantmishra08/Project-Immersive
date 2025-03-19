import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
	  origin: "http://localhost:5173", // Ye frontend ka port hai
	  methods: ["GET", "POST"],
	  credentials: true,
	},
  });

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// Edit message socket event
socket.on("editMessage", (updatedMessage) => {
	io.to(updatedMessage.receiverId.toString()).emit("messageEdited", updatedMessage);
	io.to(updatedMessage.senderId.toString()).emit("messageEdited", updatedMessage);
  });
  
  // Delete message socket event
  socket.on("deleteMessage", (messageId) => {
	io.emit("messageDeleted", messageId);
  });
  socket.on("typing", ({ senderId, receiverId }) => {
	io.to(receiverId.toString()).emit("userTyping", senderId);
  });
  
  socket.on("stopTyping", ({ senderId, receiverId }) => {
	io.to(receiverId.toString()).emit("userStoppedTyping", senderId);
  });

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

  
  

export { app, io, server };


// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Ye frontend ka port hai
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("🔥 User connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

// export { app, server, io };
