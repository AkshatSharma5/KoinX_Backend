const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cryptoRoutes = require("./src/routes/cryptoRoutes");
const { showIntroPage } = require("./src/controllers/cryptoController");

dotenv.config();

const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MONGODB"))
  .catch((error) => console.log("Error connecting to db: ", error));

app.use(express.json());
app.get("/", showIntroPage);
app.use("/api", cryptoRoutes);

module.exports = app;
