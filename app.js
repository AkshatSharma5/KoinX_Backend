const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cryptoRoutes = require("./src/routes/cryptoRoutes");

dotenv.config();

const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MONGODB"))
  .catch((error) => console.log("Error connecting to db: ", error));

app.use(express.json());
app.use("/api", cryptoRoutes);

module.exports = app;
