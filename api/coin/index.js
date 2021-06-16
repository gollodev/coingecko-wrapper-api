const { Router }     = require('express')
const router         = Router()

const coinModel      = require('./model')
const CoinController = require('./controller')
const coinController = new CoinController(coinModel)

// Coin Routes
router.get('/coins', coinController.getCoins)
router.post('/coin', coinController.addCoins)

module.exports = router