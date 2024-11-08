const express = require("express");
const http = require("http");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bodyParser = require("body-parser");
const path = require("path");
const { Server } = require("socket.io");

const port = 2000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Use FileSync adapter for JSON file
const adapter = new FileSync("db.json");
const db = low(adapter);

// Initialize Database
db.defaults({ messages: [] }).write();

// Middleware
app.use(express.static(path.join(__dirname, "assets")));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "assets", "index.html"));
});

// Chat route
app.post("/chat", (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).send("Name and message are required.");
  }

  db.get("messages").push({ name, message }).write();
  io.emit("chat message", { name, message }); // Emit message to all clients
  res.send(`${name}: ${message}`);
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server connected to port ${port}`);
});
