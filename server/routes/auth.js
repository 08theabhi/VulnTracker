const r = require('express').Router(), c = require('../controllers/authController'), m = require('../middleware/auth')
r.post('/register', c.register); r.post('/login', c.login); r.get('/me', m, c.me); r.post('/change-password', m, c.changePassword)
module.exports = r
