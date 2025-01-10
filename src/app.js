const express = require('express');
const connectDB = require('./config/database');
const cryptoRoutes = require('./routes/cryptoRoutes');

const app = express();
connectDB();

app.use(express.json());
app.use('/api', cryptoRoutes);

module.exports = app;
