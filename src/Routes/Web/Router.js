const Controller = require("../../Controller/Controller");
const Middleware = require("../../Middleware/Middleware");
var express = require('express')
var router = express.Router()

router.get("/", Controller.Index.index);
router.get("/login", Controller.Auth.loginPage); //done
router.post("/login", Controller.Auth.login); //done
router.get("/signup", Controller.Auth.signupPage); //done
router.post("/signup", Middleware.Validator.signupData, Controller.Auth.signup); //done

module.exports = router