const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URL);

    console.log(`DB Connected Successfully ${dbConnection.connection.host}`);
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

module.exports = dbConnection;
