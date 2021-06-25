const db = require('../Model/Model')
const { createToken } = require('../Utilities/Utility')

let loginPage = (req, res) => res.render('login', { msg: "" })

let login = async (req, res) => {
  let users = await db.target("users").get({ where: `username = '${req.body.username}' AND password = '${req.body.password}'` })
  if (users.length == 1) return res.cookie('token', createToken(users[0].id)).redirect('/') // 8 hourse
  else return res.render('login', { msg: "loginError" })
}

let signupPage = (req, res) => res.render('signup')

let signup = async (req, res) => {
  let msg = await db.target("users").add(req.body, ['username', 'password'])
  if (msg == null) return res.render('signup', { msg: "Username isn't available" })
  else return res.redirect('/login')
}

let logout = (req, res) => res.clearCookie('token').redirect('/')

module.exports = { loginPage, login, signupPage, signup, logout }