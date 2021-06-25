const db = require('../Model/Model')
const { verifyToken } = require('../Utilities/Utility')

let auth = async (req, res, next) => {
  if (req.cookies.token == undefined || req.cookies.token == null) return res.render('login', { msg: "authError" })
  else {
    let users = await db.target("users").get({ where: `id = '${verifyToken(req.cookies.token)}'` })
    if (users.length == 1) return next()
    else return res.render('login', { msg: "authError" })
  }
}

let admin = async (req, res, next) => {
  let users = await db.target("users").get({ where: `id = '${verifyToken(req.cookies.token)}'` })
  if (users.length == 1 && users[0].role == 'admin') return next()
  else return res.render('login', { msg: "accessError" })
}

module.exports = { admin, auth }