const UserModel = require('../../Model/User')
const { createToken } = require('../../Utilities/Utility')

let login = async (req, res) => {
  let users = await new UserModel().get({ where: `username = '${req.body.username}' AND password = '${req.body.password}'` })
  if (users.length == 1) return res.status(200).json({ token: createToken(users[0].id) })
  else return res.status(404).json({ err: "user not founded" })
}

let signup = async (req, res) => {
  let result = await new UserModel().add(req.body, { unique: [{ key: `username`, value: `${req.body.username}` }, { key: `email`, value: `${req.body.email}` }] })
  if (result == 0) res.status(201).json({ msg: `user created successfully :D` })
  else res.status(406).json({ msg: `error creating user :(` })
}

module.exports = { login, signup }