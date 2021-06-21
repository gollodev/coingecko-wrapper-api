const mongoose   = require('mongoose')
const { Schema } = mongoose

const coinSchema = new Schema({}, { strict: false })

module.exports = mongoose.model('Coin', coinSchema)