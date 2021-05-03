let { uploadPath } = require('../../uploadPath')
const uuid = require('uuid').v4

class Upload {
  async upload(file) {
    let fileExtention = file.mimetype
    fileExtention = fileExtention.slice(fileExtention.indexOf("/") + 1)
    file.name = uuid() + '.' + fileExtention
    uploadPath += file.name
    return new Promise((resolve, reject) => {
      file.mv(uploadPath, err => {
        if (err) return res.send(err)
        else resolve(file.name)
      })
    })
  }
}