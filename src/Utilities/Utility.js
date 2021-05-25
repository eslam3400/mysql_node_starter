let { uploadPath } = require('../../uploadPath')
const uuid = require('uuid').v4
const jwt = require('jsonwebtoken')
const TOKEN_SECRET = 'devtik'; // require('crypto').randomBytes(64).toString('hex')

let uploadFile = async file => {
  if (file) {
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
  } else return null
}

let uploadFiles = async files => {
  if (files)
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
  else return null
}

let generateID = () => uuid()

let createToken = data => jwt.sign(data, TOKEN_SECRET)

let verifyToken = token => jwt.verify(token, TOKEN_SECRET, (err, data) => data)

module.exports = { uploadFile, uploadFiles, generateID, verifyToken, createToken }