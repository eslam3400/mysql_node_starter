const db = require('../../Model/Model')
const { createToken, verifyToken } = require('../../Utilities/Utility')

let login = async (req, res) => {
  let users = await db.target(`users`).get({ where: `username = '${req.body.username}' AND password = '${req.body.password}'` })
  if (users.length == 1) res.status(200).json({ token: createToken(users[0].id) })
  else res.status(404).json({ err: "user not founded" })
}

let signup = async (req, res) => {
  let result = await db.target('users').add(req.body, ['username'])
  if (result == null) res.status(406).json({ err: `error creating new user cause this username is already in use` })
  else res.status(201).json({ msg: `user created successfully :D` })
}

let userData = async (req, res) => {
  let users = await db.target('users').get({ where: `id = '${verifyToken(req.get('Token'))}'` })
  if (users.length == 1) res.status(200).json(users[0])
  else res.status(404).json({ err: `user not founded` })
}

module.exports = { login, signup, userData }