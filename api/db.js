const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)

// Function to connect Mongo Database
async function connectDb() {
    const connectionString = 'mongodb+srv://jose:root@coingecko.hg63j.mongodb.net/testdatabase?retryWrites=true&w=majority'
    try {
        const connector = await mongoose.connect(
            connectionString, 
            { useNewUrlParser: true },
            { useUnifiedTopology: true }
        )
        if (connector) {
            console.log('MongoDB Run Successfully!')
        } else {
            console.log(connector.Error)
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb;