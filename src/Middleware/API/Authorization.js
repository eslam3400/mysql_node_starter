const UserModel = require('../../Model/User')
const { verifyToken } = require('../../Utilities/Utility')

let admin = async (req, res, next) => {
  let users = await new UserModel().get({ where: `id = ${verifyToken(req.get('Token'))}` })
  if (users.length > 0 && users[0].role == 'admin') next()
  else res.json({ msg: "Not Authorized" })
}

module.exports = { admin }