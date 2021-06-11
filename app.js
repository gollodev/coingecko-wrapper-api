const express = require('express');
const mongoose = require('mongoose');
const app = express();

const connectDb = require('./api/db')();

const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// Main Set Routes
app.get('/', (_, res) => res.json({ message: 'Welcome to Coingecko Wrapper API'}));


// Server Listen
app.listen(port, () => console.log(`Server running on Port: localhost:${3000}`));

