const r = require('express').Router(), m = require('../middleware/auth'), c = require('../controllers/exportController')
r.use(m); r.get('/csv', c.exportCSV); r.get('/json', c.exportJSON); r.get('/history', c.getHistory)
module.exports = r
