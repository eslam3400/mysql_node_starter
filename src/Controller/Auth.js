const db = require('../Model/Model')
const { createToken, hash, unhash } = require('../Utilities/Utility')

let loginPage = (req, res) => res.render('login', { msg: null })

let login = async (req, res) => {
  let users = await db.target("users").get({ where: `username = '${req.body.username}'` })
  if (users.length == 1) {
    if (await unhash(req.body.password, users[0].password))
      return res.cookie('token', createToken(users[0].id)).redirect('/')
    else return res.render('login', { msg: "Username Or Password Are Wrong Please Check Ur Details And Try Again" })
  }// 8 hourse
  else return res.render('login', { msg: "Username Or Password Are Wrong Please Check Ur Details And Try Again" })
}

let signupPage = (req, res) => res.render('signup')

let signup = async (req, res) => {
  req.body.password = await hash(req.body.password)
  let msg = await db.target("users").add(req.body, ['username'])
  if (msg == null) return res.render('signup', { msg: "Username isn't available" })
  else return res.redirect('/login')
}

let logout = (req, res) => res.clearCookie('token').redirect('/')

module.exports = { loginPage, login, signupPage, signup, logout }