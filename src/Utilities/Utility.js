const { uploadPath } = require('../../uploadPath')
const { exec } = require("child_process");
const uuid = require('uuid').v4
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const TOKEN_SECRET = 'devtik'; // require('crypto').randomBytes(64).toString('hex')
const saltRounds = 10;

let uploadFiles = async files => {
  if (files) {
    if (files.img.length > 1)
      return new Promise((resolve, reject) => {
        let imgs = files.img
        imgs.forEach(img => {
          let fileExtention = img.mimetype
          fileExtention = fileExtention.slice(fileExtention.indexOf("/") + 1)
          img.name = new Date().getTime() + '.' + fileExtention
          file.mv(uploadPath + img.name, err => {
            if (err) console.log(err)
          })
        });
      })
    else {
      return new Promise((resolve, reject) => {
        let imgs = files.img
        let fileExtention = img.mimetype
        fileExtention = fileExtention.slice(fileExtention.indexOf("/") + 1)
        img.name = new Date().getTime() + '.' + fileExtention
        file.mv(uploadPath + img.name, err => {
          if (err) console.log(err)
          else resolve(img.name)
        })
      })
    }
  } else return null
}

let generateID = () => uuid()

let createToken = data => jwt.sign(data, TOKEN_SECRET)

let verifyToken = token => jwt.verify(token, TOKEN_SECRET, (err, data) => data)

let hash = async (text) => await bcrypt.hash(text, saltRounds)

let unhash = async (text, hashed) => await bcrypt.compare(text, hashed)

let created_at = (date) => date.toString().substr(0, 15)

let executeCommandLine = (command) => exec(command)

module.exports = {
  uploadFile,
  uploadFiles,
  generateID,
  verifyToken,
  createToken,
  created_at,
  hash,
  unhash,
  executeCommandLine
}