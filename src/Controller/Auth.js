const UserModel = require('../Model/User')

let loginPage = (req, res) =>
  res.render('login', { message: "" })

let login = async () => {
  let users = await new UserModel().get({ where: `email = '${req.body.email}' AND password = '${req.body.password}'` })
  if (users.length > 0) res.cookie('token', data[0].id, { maxAge: 43200000 }).redirect('/')
  else res.render('login', { message: "loginError" })
}

let signupPage = (req, res) =>
  res.render('signup')

let signup = (req, res) =>
  new UserModel.add(req.body)

let logout = (req, res) =>
  res.clearCookie('token').redirect('/')

module.exports = { loginPage, login, signupPage, signup, logout }