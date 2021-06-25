let { uploadPath } = require('../../uploadPath')
const uuid = require('uuid').v4
const jwt = require('jsonwebtoken')
const TOKEN_SECRET = 'devtik'; // require('crypto').randomBytes(64).toString('hex')
const bcrypt = require('bcrypt')
const saltRounds = 10;

let uploadFile = async file => {
  let fileExtention = file.mimetype
  fileExtention = fileExtention.slice(fileExtention.indexOf("/") + 1)
  file.name = uuid() + '.' + fileExtention
  uploadPath += file.name
  return new Promise((resolve, reject) => {
    file.mv(uploadPath, err => {
      if (err) resolve(null)
      else resolve(file.name)
    })
  })
}

let uploadFiles = async files => {
  return new Promise((resolve, reject) => {
    files.forEach(file => {
      let fileExtention = file.mimetype
      fileExtention = fileExtention.slice(fileExtention.indexOf("/") + 1)
      file.name = uuid() + '.' + fileExtention
      uploadPath += file.name
      file.mv(uploadPath + file.name, err => {
        if (err) console.log(err)
        else console.log('done')
      })
    });
  })
}

let generateID = () => uuid()

let createToken = data => jwt.sign(data, TOKEN_SECRET)

let verifyToken = token => jwt.verify(token, TOKEN_SECRET, (err, data) => data)

let hash = async (text) => await bcrypt.hash(text, saltRounds)

let unhash = async (text, hashed) => await bcrypt.compare(text, hashed)

let created_at = (date) => date.toString().substr(0, 15)

module.exports = {
  uploadFile,
  uploadFiles,
  generateID,
  verifyToken,
  createToken,
  created_at,
  hash,
  unhash
}