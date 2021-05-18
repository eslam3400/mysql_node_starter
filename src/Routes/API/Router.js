const APIController = require("../../Controller/API/Controller");
var express = require('express')
var router = express.Router()

/**
 * Auth
 */
router.post("/login", APIController.Auth.login);
router.post("/signup", APIController.Auth.signup);
/**
 * User
 */
router.get("/user", APIController.User.user);

module.exports = router