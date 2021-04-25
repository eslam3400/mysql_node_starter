const Model = require('../Model/Model')

let auth = (req, res, next) => {
  if (req.cookies.token == undefined || req.cookies.token == null) res.render('login', { message: "authError" })
  else next()
}

module.exports = { auth }