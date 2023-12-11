const mongoose = require("mongoose");
const Document = require("./src/Model/Document");
const authenticateToken = require("./src/Middleware/authMiddleware");
const authRoutes = require("./src/Routes/authRoutes");
const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const connectDB = require("./src/Database/db");

// Create an Express application
const app = express();

// Create an HTTP server using the Express application
const server = http.createServer(app);

// Create a new Socket.IO server attached to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Enable CORS for the Express application
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Parse incoming JSON requests
app.use(express.json());

// Connect to the MongoDB database
connectDB();

// Define a default value for documents
const defaultValue = "";

// Store user cursors in memory
const users = {};

function updateUserCursor(userId, cursorData) {
  users[userId] = cursorData;
}

function getAllUserCursors() {
  return Object.values(users);
}

// Middleware to authenticate Socket.IO connections using JWT
io.use((socket, next) => {
  const token = socket.handshake.query.token || socket.handshake.headers.authorization;

  if (!token) {
    socket.emit("unauthorized", { message: "Unauthorized" });
  }

  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) {
      socket.emit("unauthorized", { message: "Unauthorized" });
    }

    socket.user = user;
    next();
  });
});

// Event listener for a new Socket.IO connection
io.on("connection", (socket) => {

  // Event listener for getting a document
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    // Event listener for receiving changes from a user
    socket.on("send-changes", (delta, userId, username, cursorPosition) => {
      console.log(delta,userId,username,cursorPosition,"???????????")
      updateUserCursor(userId, { id: userId, name: username, color: "#ff0000" });
      const userCursors = getAllUserCursors();
      io.to(documentId).emit("user-cursors", userCursors);
      socket.broadcast.to(documentId).emit("receive-changes", delta,userId, username, cursorPosition);
    });

    // Event listener for saving document changes
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });

     // Event listener for disconnecting a user
    socket.on("disconnect", () => {
      // removeUser(socket.user?.userId);
      const userCursors = getAllUserCursors();
      io.to(documentId).emit("user-cursors", userCursors);
    });
  });
});

// Function to find or create a document by ID
async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}

// Use authentication routes under the "/api" prefix
app.use("/api", authRoutes);

// Set the server to listen on port 3002
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
