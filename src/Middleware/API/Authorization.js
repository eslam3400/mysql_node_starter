const UserModel = require('../../Model/User')
const { verifyToken } = require('../../Utilities/Utility')

let auth = (req, res, next) => {
  if (req.get('Token') == undefined || req.get('Token') == null) return res.status(404).json({ msg: 'Not Authourized' })
  else return next()
}

let admin = async (req, res, next) => {
  let users = await new UserModel().get({ where: `id = ${verifyToken(req.get('Token'))}` })
  if (users.length == 1 && users[0].role == 'admin') return next()
  else return res.json({ msg: "Not Authorized" })
}

module.exports = { admin, auth }