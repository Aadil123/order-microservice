const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/orders', require('./routes/order.routes'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});