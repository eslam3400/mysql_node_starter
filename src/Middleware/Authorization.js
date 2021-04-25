const Model = require('../Model/Model')

let admin = (req, res, next) => {
  new Model('users').get({ where: `id = ${req.cookies.token}` }, data => {
    if (data.length > 0 && data[0].role == 'admin') next()
    else res.render('/login', { message: "accessError" })
  })
}

module.exports = { auth }