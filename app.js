const express = require('express');
const connectDB = require('./src/config/database');
const cryptoRoutes = require('./src/routes/cryptoRoutes');

const app = express();
connectDB();

app.use(express.json());
app.use('/api', cryptoRoutes);

module.exports = app;
