const Model = require('../Model/Model')

let auth = (req, res, next) => {
  if (req.cookies.token == undefined || req.cookies.token == null) res.redirect('/')
  else new Model('users').getOneByDocId(req.cookies.token, data => {
    if (data.role == 'admin') next()
    else res.redirect('/')
  })
}

module.exports = { auth }