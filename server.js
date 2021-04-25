const express = require('express')
const cookie = require('cookie-parser')
const Controller = require('./src/Controller/Controller')
const Middleware = require('./src/Middleware/Middleware')
const path = require('path')
const app = express()
const port = 3000
/*
  Setup the view engine to the ejs
*/
app.set('view engine', 'ejs')
/*
  by default we can't access a file from the front end for security purposes
  so when we wanna get files to the front-end we need to make them static like that
*/
app.use(express.static(path.join(__dirname, 'public')))
/**
 * by using this i can access data from post reqest with the body object
 */
app.use(express.urlencoded())
/**
 * by using this i can access cookies data from cookies object
 */
app.use(cookie("DevTik"))

app.get('/login', Controller.Auth.loginPage)
app.post('/login', Controller.Auth.login)
app.get('/signup', Controller.Auth.signupPage)
app.post('/signup', Controller.Auth.signup)

app.listen(process.env.PORT || port, () => console.log(`app listening at http://localhost:${port}`))