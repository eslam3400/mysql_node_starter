const path = require('path')
const db = require('./src/Model/Model')
const express = require('express')
const cookie = require('cookie-parser')
const fileUpload = require("express-fileupload");
const WebRouter = require("./src/Routes/Web/Router")
const APIRouter = require("./src/Routes/API/Router")
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
/**
 * by using this i can access files data from req.files object
 */
app.use(fileUpload())
/**
 * Database Connection Configrations
 */
db.config({ host: 'localhost', user: 'root', password: '', database: 'test' })
/**
 * Routers
 */
app.use("/API/", APIRouter)
app.use("/", WebRouter)

app.listen(process.env.PORT || port, () => console.log(`app listening at http://localhost:${port}`))