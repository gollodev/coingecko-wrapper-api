const { Router }      = require('express')
const router          = Router()

const userModel       = require('../user/model')
const coinModel       = require('./model')
const CoinController  = require('./controller')
const coinController  = new CoinController(coinModel, userModel)
const { verifyToken } = require('../lib/jwt')
router.use(verifyToken)

// Coin Routes
router.get('/coins', verifyToken, coinController.getCoins)
router.get('/coins/top', verifyToken, coinController.topCoins)
router.post('/coin/:coinId', verifyToken, coinController.addCoins)

module.exports = router