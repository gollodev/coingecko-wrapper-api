const jwt = require('jsonwebtoken')

function createToken (data, res) {
    jwt.sign({ data }, 'secretKey', { expiresIn: '1h'}, (error, token) => {
        if (error) {
            return res.status(404).json({
                statusCode: 404,
                message: error.message
            })
        }
        return res.status(201).json({
            statusCode: 201,
            token
        })
    })
}

function verifyToken(req, res, next) {
    const token = req.headers['access-token']
    if (token) {
        jwt.verify(token, 'secretKey', (err, verifiedJwt) => {
            if (err) {
                return res.status(403).json({
                    statusCode: 403,
                    message: 'You token is invalid'
                })
            }
            req.user = verifiedJwt 
            return next()
        })
    } else {
        return res.status(403).json({
            statusCode: 403, message: 'You need a token'
        })
    }
}

module.exports = {
    createToken,
    verifyToken
}
