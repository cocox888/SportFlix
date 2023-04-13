const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
require("dotenv/config");

// Socket setup

global.io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true,
  },
});

const mongoose = require("mongoose");

const authRoute = require("./Routes/authRoute");
const eventRoute = require("./Routes/eventRoute");

app.use(cors());
app.use(express.json());

// DB connection

const connectDB = () => {
  const uri = process.env.DB_CONNECTION;
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("CONNECTED TO Database");
};

// Routes and middlewares

// serving the client static files
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/events", eventRoute);
app.get("/check", (req, res) => {
  res.send(
    "Sportflix backend: you better have the access or I'll hunt you down"
  );
});

app.use(express.static("Client/build"));
app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/Client/build/index.html");
});

// Listening to the server
server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

connectDB();
