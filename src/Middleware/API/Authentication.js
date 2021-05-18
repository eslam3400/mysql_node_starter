let auth = (req, res, next) => {
  if (req.get('Token') == undefined || req.get('Token') == null) res.status(404).json({ msg: 'Not Authourized' })
  else next()
}

module.exports = { auth }