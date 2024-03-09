const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const router = require("./routes/index");
const dbConnection = require("./dbConfig/dbConnection");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

// MONGODB CONNECTION
dbConnection();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse application
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Api is working");
});
app.use(router);
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Dev Server running on port: ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id, "user id getting in socket");
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
