const UserModel = require('../Model/User')

let admin = async (req, res, next) => {
  let users = await new UserModel().get({ where: `id = ${req.cookies.token}` })
  if (users.length > 0 && users[0].role == 'admin') next()
  else res.render('login', { message: "accessError" })
}

module.exports = { admin }