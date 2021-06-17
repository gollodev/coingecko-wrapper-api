const CoinGecko       = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()
const { verifyToken } = require('../lib/jwt')
const mongoose        = require('mongoose')

class CoinController {
    constructor(coinModel, userModel) {
        if (!coinModel) throw new Error('CoinModel is undefined!')
        if (!userModel) throw new Error('UserModel is undefined!')
        
        this.Coin        = coinModel
        this.User        = userModel
        this.getCoins    = this.getCoins.bind(this)
        this.addCoins    = this.addCoins.bind(this)
        this._fetchCoins = this._fetchCoins.bind(this)

        this._fetchCoins()
    }

    async _fetchCoins() {
        try {
            const coins = await this.Coin.findOne()
            if (!coins) {
                // if Coin Collection not have any data, then fetch from Coingecko API
                console.log('coins collection not have data, then fetch from coingecko api')
                const coingeckoServerStatus = await CoinGeckoClient.ping()
                if (coingeckoServerStatus) {
                    /**
                    *   if the coingecko server is ready...
                    *   we need: symbol, price, name, image, last_updated fields to store in database
                    **/
                    console.log('coingecko server is ready!')
                    try {
                        const coinsList = await CoinGeckoClient.coins.all()
    
                        if (coinsList.success && coinsList.code === 200) {
                            let newCoinList = []
                            let fields = ['symbol', 'name', 'market_data', 'image', 'last_updated']
                        
                            coinsList.data.map(coins => {
                                const filteredCoin = Object.keys(coins)
                                                       .filter(key => fields.includes(key))
                                                       .reduce((obj, key) => {
                                                           obj[key] = coins[key]
                                                           return obj
                                                       }, {})
                                return newCoinList.push(filteredCoin)
                            })
                            this.Coin.collection.insert(newCoinList, (err, coin) => {
                                if (err) throw new Error(err)
                                if (coin) console.log('coins save successfully in database!')
                            })
                        } else {
                            console.log('some error on coingecko server')
                        }
                    } catch (error) {
                        throw new Error(error)
                    }
                } else {
                    console.log('coingecko server not found')
                }
            } else {
                console.log('You database is updated!')
            }
        } catch (error) {
            console.log('some error on request coins')
        }
    }

    async getCoins(req,res) {
        const currentUser = req.user.data
        if (currentUser) {
            const currencyUser = currentUser.currency
            try {
                const coin = await this.Coin.find().select(`symbol name image market_data.current_price.${currencyUser}`)
                return res.status(200).json({
                        statusCode: 200,
                        data: coin
                })
            } catch (error) {
                return res.status(404).json({
                    statusCode: 404,
                    message: error.message
                })
            }
        } else {
            return res.status(403).json({
                    statusCode: 403,
                    message: 'Token Unauthorized'
                })
        }
        
    }

    async addCoins(req,res) {
        const currentUser = req.user.data
        const coinId      = req.params.coinId
        console.log(typeof coinId)

        if (!currentUser) {
            return res.status(403).json({ statusCode: 403, message: 'user not logged'})
        }

        if (!coinId) {
            return res.status(404).json({ statusCode: 404, message: 'req.params.coinId is undefined' })
        }

        try {
            let coinsExist
            const searchByUserId = { _id: currentUser._id }
            const pushCoin = { $push: { coins: mongoose.Types.ObjectId(coinId) } }
            
            const saveCriptoToUser = await this.User.findOneAndUpdate(searchByUserId, pushCoin)

            if (saveCriptoToUser) {
                return res.status(201).json({
                    statusCode: 201,
                    message: 'Coin Added To User Successfully!'
                })
            } else {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'user not found'
                })
            }
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message
            })
        }
    }

    async topCoins(req, res) {
        const currentUser = req.user.data

        if (!currentUser) {
            return res.status(403).json({ statusCode: 403, message: 'user not logged'})
        }

        try {
            const user = await this.User.findOne()
        } catch (error) {
            return res.status(404).json({
                statusCode: 404,
                message: error.message
            })
        }
    }
}

module.exports = CoinController