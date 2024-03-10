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
const path = require("path");

const PORT = process.env.PORT || 8000;

// MONGODB CONNECTION
dbConnection();

app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["POST", "GET", "PUT", "PATCH"],
    origin: "https://mern-live-chat-app.netlify.app",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse application
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Api is working");
});
app.use(router);

// --------------------------deployment------------------------------

// const __dirname1 = path.resolve();
// console.log(path.join(__dirname1, "..", "/frontend/build"));
// if (process.env.NODE_ENV === "production") {
//   console.log("production");
//   app.use(express.static(path.join(__dirname1, "..", "/client/dist")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.join(__dirname1, "..", "client", "dist", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     console.log("development");
//     res.send("API is running..");
//   });
// }

// --------------------------deployment------------------------------

app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Dev Server running on port: ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    // origin: [
    //   "http://localhost:5173",
    //   "https://mern-live-chat-app.netlify.app/",
    // ],
    origin: "https://mern-live-chat-app.netlify.app",
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
