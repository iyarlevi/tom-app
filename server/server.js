require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://tom-app.onrender.com",
    methods: ["GET", "POST"],
  },
});

const codeBlockRoutes = require("./routes/codeBlockRoutes");
const socketHandler = require("./socket/handlers");

socketHandler(io);

// Middleware setup
app.use(cors());
app.use(express.json());
app.use("/api", codeBlockRoutes);

let rooms = {};

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("join", ({ blockId }) => {
    socket.join(blockId);

    if (!rooms[blockId]) {
      rooms[blockId] = 0;
    }
    rooms[blockId] += 1;

    io.to(blockId).emit("studentCount", rooms[blockId]);

    console.log(
      `User joined room: ${blockId}, total students: ${rooms[blockId]}`
    );

    socket.on("disconnect", () => {
      if (rooms[blockId]) {
        rooms[blockId] -= 1;
        console.log(
          `User left room: ${blockId}, remaining students: ${rooms[blockId]}`
        );

        if (rooms[blockId] <= 0) {
          delete rooms[blockId];
        } else {
          io.to(blockId).emit("studentCount", rooms[blockId]);
        }
      }

      console.log("User disconnected: ", socket.id);
    });
  });
});

// DB connection
const dbURI = process.env.MONGODB_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    console.log("Connection status:", mongoose.connection.readyState);
    console.log("Connected to database:", mongoose.connection.name);
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
