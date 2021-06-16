const mongoose   = require('mongoose')
const { Schema } = mongoose

const Coin = require('../coin/model')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        require: true
    },
    userName: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 8,
        max: 24
    },
    currency: {
        type: String,
        require: true,
        lowercase: true,
        enum: { values: ['usd', 'eur', 'ars'], message: 'Invalid value only (usd,eur,ars) currency are valid' },
        default: 'usd'
    },
    coin: {
        type: mongoose.ObjectId,
        ref: Coin
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)