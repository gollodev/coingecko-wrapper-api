const fetch = require('node-fetch')
const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()

class CoinController {
    constructor(coinModel) {
        if (!coinModel) throw new Error('CoinModel is undefined!')
        
        this.Coin        = coinModel
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
                    console.log('coingecko server ready!')
                    try {
                        const coinsList = await CoinGeckoClient.coins.all()
    
                        if (coinsList.success && coinsList.code === 200) {
                            let newCoinList = []
                            let newCoin = {}
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
                                if (err) console.log('${err}')
                                if (coin) console.log('coins save successfully in database!')
                            })
                        } else {
                            console.log('some error on coingecko server')
                        }
                    } catch (error) {
                        console.log(error)
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
        res.json({
            message: req.body
        })
    }

    async addCoins(req,res) {
        res.json({
            message: req.body
        })
    }
}

module.exports = CoinController