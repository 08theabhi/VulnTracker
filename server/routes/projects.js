const r = require('express').Router(), m = require('../middleware/auth'), c = require('../controllers/projectController')
r.use(m); r.get('/risk-score', c.getRiskScore); r.get('/', c.getAll); r.post('/', c.create); r.put('/:id', c.update); r.delete('/:id', c.delete)
module.exports = r
