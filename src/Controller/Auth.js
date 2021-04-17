const Model = require('../Model/Model')

let loginPage = (req, res) => {
  res.render('login', { message: "" })
}

let login = (req, res) => {
  new Model('users').get({ where: `email = '${req.body.email}' AND password = '${req.body.password}'` }, data => {
    if (data.length > 0) res.cookie('token', data[0].id, { maxAge: 43200000 }).redirect('/')
    else res.render('/login', { message: "loginError" })
  })
}

let signupPage = (req, res) => {
  res.render('signup')
}

let signup = (req, res) => {
  let user = req.body
  new Model('users').add(user)
}

let logout = (req, res) => {
  res.clearCookie('token').redirect('/')
}

module.exports = { loginPage, login, signupPage, signup, logout }