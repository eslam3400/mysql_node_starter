const Model = require('../Model/Model')

let auth = (req, res, next) => {
  if (req.cookies.token == undefined || req.cookies.token == null) res.redirect('/')
  else new Model('users').get({ where: `id = ${req.cookies.token}` }, data => {
    if (data.length > 0 && data[0].role == 'admin') next()
    else res.redirect('/')
  })
}

module.exports = { auth }