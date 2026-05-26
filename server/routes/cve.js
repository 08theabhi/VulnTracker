const r = require('express').Router(), m = require('../middleware/auth'), c = require('../controllers/cveController')
r.use(m); r.post('/scan', c.scan); r.get('/results', c.getResults); r.get('/stats', c.getStats); r.patch('/read-all', c.markAllRead); r.patch('/:id/read', c.markRead)
module.exports = r
