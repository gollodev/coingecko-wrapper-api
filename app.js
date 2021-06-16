const express    = require('express');
const mongoose   = require('mongoose');
const app        = express();
const port       = process.env.PORT || 3000;

// Set Database
const connectDb = require('./api/db')();

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Imports Modules
const userRoutes = require('./api/user')
const coinRoutes = require('./api/coin')

// Main Set Routes
app.get('/', (_, res) => res.json({ message: 'Welcome to Coingecko Wrapper API'}))
app.use('/user/', userRoutes)
app.use('/coin/', coinRoutes)

// Error Handler
app.use((req,res,next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        statusCode: err.status,
        error: {
            message: err.message
        }
    })
})

// Server Listen
app.listen(port, () => console.log(`Server running on Port: localhost:${3000}`))

