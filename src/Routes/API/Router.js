const APIController = require("../../Controller/API/Controller");
const APIMiddleware = require("../../Middleware/API/Middleware");
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
router.get("/user", APIMiddleware.Auth.auth, APIController.Auth.userData);

module.exports = router