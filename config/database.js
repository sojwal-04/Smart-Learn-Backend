const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.DB_URL;

exports.connect = () => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log("Error connecting to database");
      console.log(err);
    });
};
