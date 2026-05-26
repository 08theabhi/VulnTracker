const r = require('express').Router(), m = require('../middleware/auth'), c = require('../controllers/urlScanController')
r.use(m); r.post('/', c.scanUrl)
module.exports = r
