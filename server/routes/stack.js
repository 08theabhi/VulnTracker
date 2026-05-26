const r = require('express').Router(), m = require('../middleware/auth'), c = require('../controllers/stackController')
r.use(m); r.get('/', c.getAll); r.post('/', c.add); r.put('/:id', c.update); r.delete('/:id', c.delete)
module.exports = r
