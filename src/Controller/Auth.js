const UserModel = require('../Model/User')
const { createToken } = require('../Utilities/Utility')

let loginPage = (req, res) => res.render('login', { msg: "" })

let login = async (req, res) => {
  let users = await new UserModel().get({ where: `email = '${req.body.email}' AND password = '${req.body.password}'` })
  if (users.length == 1) return res.cookie('token', createToken(users[0].id)).redirect('/') // 8 hourse
  else return res.render('login', { msg: "loginError" })
}

let signupPage = (req, res) => res.render('signup')

let signup = async (req, res) => {
  let msg = await new UserModel().add(req.body, { unique: [{ key: 'email', value: `${req.body.email}` }] })
  if (msg == 0) return res.redirect('/login')
  else return res.redirect('/signup')
}

let logout = (req, res) => res.clearCookie('token').redirect('/')

module.exports = { loginPage, login, signupPage, signup, logout }