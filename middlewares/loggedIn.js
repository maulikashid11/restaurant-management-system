const jwt = require('jsonwebtoken')

function loggedIn(req, res, next) {
    const { token } = req.cookies
    if (token) {
        let user = jwt.verify(token, 'secret')
        req.user = user
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = loggedIn