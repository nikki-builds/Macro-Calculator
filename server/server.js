const express = require('express'); // web server framework
const mongoose = require('mongoose'); // MongoDB tool
const cors = require('cors'); // lets frontend (port 3000) talk to backend(port 5000)
const dotenv = require('dotenv'); // loads variables from .env file
const connectDB = require('./config/db');

// load environment variables
dotenv.config(); // read .env file and makes process.env.PORT and process.env.MONGODB_URI avaiable

// initialize Express app
const app = express(); // creates Express application(the web server) opening restaurant before customer

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()) // parse JSON request bodies

connectDB();

app.use('/api/calculations', require('./routes/calculations'));

//test route
app.get('/', (req,res)=> {
  res.json({message: 'Macro Calculator API is running!'});
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
});
