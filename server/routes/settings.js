const r = require('express').Router(), m = require('../middleware/auth'), c = require('../controllers/settingsController')
r.use(m); r.get('/', c.getSettings); r.post('/', c.saveSettings); r.post('/parse-file', c.parsePackageFile)
module.exports = r
