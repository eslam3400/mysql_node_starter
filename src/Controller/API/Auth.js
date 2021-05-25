const UserModel = require('../../Model/User')
const { createToken, verifyToken } = require('../../Utilities/Utility')

let login = async (req, res) => {
  let users = await new UserModel().get({ where: `email = '${req.body.email}' AND password = '${req.body.password}'` })
  if (users.length == 1) res.status(200).json({ token: createToken(users[0].id) })
  else res.status(404).json({ err: "user not founded" })
}

let signup = async (req, res) => {
  let result = await new UserModel().add(req.body, { unique: [{ key: `email`, value: `${req.body.email}` }] })
  if (result == 0) res.status(201).json({ msg: `user created successfully :D` })
  else res.status(406).json({ err: `error creating new user :(` })
}

let userData = async (req, res) => {
  let users = await new UserModel().get({ where: `id = '${verifyToken(req.get('Token'))}'` })
  if (users.length == 1) res.status(200).json(users[0])
  else res.status(404).json({ err: `user not founded` })
}

module.exports = { login, signup, userData }