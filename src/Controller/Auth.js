const UserModel = require('../Model/User')
const { createToken } = require('../Utilities/Utility')

let loginPage = (req, res) => res.render('login', { message: "" })

let login = async (req, res) => {
  let users = await new UserModel().get({ where: `email = '${req.body.email}' AND password = '${req.body.password}'` })
  if (users.length == 1) res.cookie('token', createToken(users[0].id), { maxAge: 28800000 }).redirect('/') // 8 hourse
  else res.render('login', { message: "loginError" })
}

let signupPage = (req, res) => res.render('signup')

let signup = (req, res) => new UserModel.add(req.body)

let logout = (req, res) => res.clearCookie('token').redirect('/')

module.exports = { loginPage, login, signupPage, signup, logout }