const express = require('express');

const port = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (_, res) => res.json({ message: 'Welcome to Coingecko Wrapper API'}));


// Server Listen
app.listen(port, () => console.log(`Server running on Port: localhost:${3000}`));

