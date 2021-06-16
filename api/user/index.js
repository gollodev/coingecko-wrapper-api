const { Router } = require('express')
const router     = Router()
const { body }   = require('express-validator')

const userModel      = require('./model')
const UserController = require('./controller')

const userController = new UserController(userModel)

// User Routes
router.post('/signup', 
body('firstName').exists(),
body('lastName').exists(),
body('userName').exists(),
body('password', 'Password must include one lowercase character, one uppercase character, a number, and a special character.')
.exists()
.isLength({ min: 8 })
.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
body('currency').exists(),
userController.signup)

router.post('/login', 
body('userName').exists(),
body('password').exists(),
userController.login)

module.exports = router