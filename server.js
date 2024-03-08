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

app.listen(PORT, () => {
  console.log(`Dev Server running on port: ${PORT}`);
});
