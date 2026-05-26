const r = require('express').Router(), m = require('../middleware/auth'), c = require('../controllers/teamController')
r.use(m); r.get('/', c.getOrg); r.post('/create', c.createOrg); r.post('/invite', c.inviteMember); r.get('/:org_id/members', c.getMembers); r.delete('/:org_id/members/:user_id', c.removeMember); r.delete('/:id', c.deleteOrg)
module.exports = r
