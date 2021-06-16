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

// Authorization: Bearer <token>
function verifyToken(req, _, next) {
    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    } else {
        req.sendStatus(403)
    }
}

module.exports = {
    createToken,
    verifyToken
}
