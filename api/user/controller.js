const { validationResult } = require('express-validator')
const { createToken }      = require('../lib/jwt')

/*
 * Class from USertValid
 * @class UserController
 */
class UserController {
    constructor(userModel) {
        if (!userModel) {
            throw new Error('UserModel is undefined')
        }
        
        this.User            = userModel
        this.signup          = this.signup.bind(this)
        this.login           = this.login.bind(this)
        this._validationBody = this._validationBody.bind(this)
    }

    _validationBody(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                statusCode: 400,
                message: {
                    errors: errors.array()
                }
            })
        }
    }

    async signup(req, res) {

        // Validation on Request Body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                statusCode: 400,
                message: {
                    errors: errors.array()
                }
            })
        }
        
        try {
            const { userName } = req.body
            const user = await this.User.findOne({ userName })
            
            if (!user) {
                try {
                    const newUser = await this.User.create(req.body)
                    console.log(newUser)
                    if (newUser) {
                        return res.status(201).json({
                            statusCode: 201,
                            message: 'User created succesfully!'
                        })
                    }
                } catch (error) {
                    return res.status(404).json({
                        statusCode: 404,
                        message: error.message
                    })
                }
            } else {
                return res.status(200).json({
                    statusCode: 200,
                    message: 'username exists!'
                })
            }
        } catch (error) {
            return res.status(404).json({
                statusCode: 404,
                message: error.message
            })
        }
    }

    async login(req, res) {

        // Validation on Request Body
        this._validationBody(req, res)

        try {
            const { userName, password } = req.body
            const user = await this.User.findOne({ userName, password })
            if (user) {
                createToken(user, res)
            } else {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'username or password invalid!'
                })
            }
        } catch (error) {
            return res.status(404).json({
                statusCode: 404,
                message: error.message
            })
        }
    }

}

module.exports = UserController